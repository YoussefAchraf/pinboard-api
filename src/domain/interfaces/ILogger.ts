/**
 * FILE:   src/domain/interfaces/ILogger.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   Logging port. Use cases and adapters log through this interface so they never import
 *   pino and never use console. The implementation adds the current requestId
 *   automatically (AsyncLocalStorage) so every log line is correlated.
 *   Rule for every caller: never pass secrets, tokens, passwords or raw PII in `context`
 *   (log ids only).
 *
 * EXPORTS
 *   interface ILogger
 *
 * USED BY
 *   infrastructure/services/PinoLogger.ts (implements), use-cases/**, adapters,
 *   interface/middlewares/errorHandlerMiddleware.ts, src/server.ts
 *
 * MAY IMPORT
 *   Nothing.
 */
export interface ILogger {
  debug(msg: string, context?: Record<string, unknown>): void;
  info(msg: string, context?: Record<string, unknown>): void;
  warn(msg: string, context?: Record<string, unknown>): void;
  error(msg: string, context?: Record<string, unknown> & { err?: unknown }): void;
  child(bindings: Record<string, unknown>): ILogger;
}
