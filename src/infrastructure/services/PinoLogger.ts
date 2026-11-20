/**
 * FILE:   src/infrastructure/services/PinoLogger.ts
 * LAYER:  infrastructure (adapters; no express / socket.io, no process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   pino implementation of ILogger: structured JSON logs, automatically enriched with the
 *   current requestId from the request context.
 *
 * WHAT TO WRITE
 *   export class PinoLogger implements ILogger {
 *     constructor(options: { level: string; pretty?: boolean }, getRequestId: () => string | undefined,
 *                 base?: pino.Logger)
 *     debug/info/warn/error(msg, context) -> this._pino[level]({ requestId: getRequestId(), ...context }, msg)
 *     child(bindings) -> new PinoLogger(options, getRequestId, this._pino.child(bindings))
 *     get pino(): pino.Logger   // handed to pino-http in the composition root
 *   }
 *   - Redact sensitive paths: ['req.headers.cookie', 'req.headers.authorization', '*.password',
 *     '*.passwordHash', '*.token', '*.refreshToken'].
 *   - `getRequestId` is injected (it reads AsyncLocalStorage from requestContextMiddleware) so
 *     infrastructure never imports the interface layer.
 *
 * EXPORTS
 *   class PinoLogger
 *
 * USED BY
 *   src/server.ts  `const logger = new PinoLogger({ level: config.logLevel }, getRequestId)` (first adapter built)
 *   src/app.ts     passes `logger` to every adapter/module; `pinoHttp({ logger: logger.pino })`
 *
 * MAY IMPORT
 *   pino, domain/interfaces/ILogger (type).
 */
export {};
