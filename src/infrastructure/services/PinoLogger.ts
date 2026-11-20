/**
 * FILE:   src/infrastructure/services/PinoLogger.ts
 * LAYER:  infrastructure (adapters; no express / socket.io, no process.env)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   pino implementation of ILogger: structured JSON logs, automatically enriched with the
 *   current requestId from the request context.
 *
 * NOTES
 *   - `getRequestId` is injected (it reads AsyncLocalStorage from requestContextMiddleware) so
 *     infrastructure never imports the interface layer.
 *   - REDACT_PATHS removes cookies, Authorization, Set-Cookie, passwords, tokens and emails, at the
 *     top level and one level deep (pino-http's req/res serializers included). Output is JSON only
 *     (no pretty transport installed).
 *
 * EXPORTS
 *   class PinoLogger, const REDACT_PATHS
 *
 * USED BY
 *   src/server.ts  `new PinoLogger({ level: config.logLevel }, getRequestId)` (first adapter built)
 *   src/app.ts     `pinoHttp({ logger: logger.pino })`
 *
 * MAY IMPORT
 *   pino, domain/interfaces/ILogger (type).
 */
import pino from 'pino';
import type { ILogger } from '../../domain/interfaces/ILogger';

const SENSITIVE_KEYS = ['password', 'passwordHash', 'token', 'accessToken', 'refreshToken', 'csrfToken', 'email'];

export const REDACT_PATHS: string[] = [
  'req.headers.cookie',
  'req.headers.authorization',
  'req.headers["x-csrf-token"]',
  'res.headers["set-cookie"]',
  ...SENSITIVE_KEYS,
  ...SENSITIVE_KEYS.map((key) => `*.${key}`),
];

export class PinoLogger implements ILogger {
  private readonly _pino: pino.Logger;

  constructor(
    private readonly _options: { level: string },
    private readonly _getRequestId: () => string | undefined,
    base?: pino.Logger,
  ) {
    this._pino = base ?? pino({ level: _options.level, redact: { paths: REDACT_PATHS, censor: '[Redacted]' } });
  }

  get pino(): pino.Logger {
    return this._pino;
  }

  debug(msg: string, context?: Record<string, unknown>): void {
    this._pino.debug(this._enrich(context), msg);
  }

  info(msg: string, context?: Record<string, unknown>): void {
    this._pino.info(this._enrich(context), msg);
  }

  warn(msg: string, context?: Record<string, unknown>): void {
    this._pino.warn(this._enrich(context), msg);
  }

  error(msg: string, context?: Record<string, unknown> & { err?: unknown }): void {
    this._pino.error(this._enrich(context), msg);
  }

  child(bindings: Record<string, unknown>): ILogger {
    return new PinoLogger(this._options, this._getRequestId, this._pino.child(bindings));
  }

  private _enrich(context?: Record<string, unknown>): Record<string, unknown> {
    const requestId = this._getRequestId();
    return requestId === undefined ? { ...context } : { requestId, ...context };
  }
}
