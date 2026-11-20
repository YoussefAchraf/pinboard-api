/**
 * FILE:   src/domain/interfaces/ILogger.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Logging port. Use cases and adapters log through this interface so they never import
 *   pino and never use console. The implementation adds the current requestId
 *   automatically (AsyncLocalStorage) so every log line is correlated.
 *
 * WHAT TO WRITE
 *   export interface ILogger {
 *     debug(msg: string, context?: Record<string, unknown>): void;
 *     info(msg: string, context?: Record<string, unknown>): void;
 *     warn(msg: string, context?: Record<string, unknown>): void;
 *     error(msg: string, context?: Record<string, unknown> & { err?: unknown }): void;
 *     child(bindings: Record<string, unknown>): ILogger;
 *   }
 *   Rule for every caller: never pass secrets, tokens, passwords or raw PII in `context`.
 *
 * EXPORTS
 *   interface ILogger
 *
 * USED BY
 *   infrastructure/services/PinoLogger.ts            `implements ILogger`
 *   use-cases/** (optional dependency)               this._deps.logger.info('user.login', { userId })
 *   interface/middlewares/errorHandlerMiddleware.ts  logs unexpected errors with requestId
 *   src/server.ts                                    startup / shutdown messages
 *
 * MAY IMPORT
 *   Nothing.
 */
export {};
