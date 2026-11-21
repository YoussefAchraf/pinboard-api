/**
 * FILE:   src/interface/middlewares/sanitizeMiddleware.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   Defense in depth against stored XSS: strips HTML from every string in req.body (objects and
 *   arrays, depth <= 10; deeper values are left untouched). zod validation remains the primary
 *   input contract; output encoding is the frontend's job.
 *   - Fields named in `skipFields` (any depth, e.g. 'password') are never touched.
 *   - req.query is NOT mutated (read-only getter in Express 5); query/params are validated with zod.
 *
 * EXPORTS
 *   function sanitizeMiddleware
 *
 * USED BY
 *   src/app.ts   `app.use(sanitizeMiddleware({ skipFields: ['password'] }))` after express.json()
 *
 * MAY IMPORT
 *   express (types), xss.
 */
import type { RequestHandler } from 'express';
import { FilterXSS } from 'xss';

const MAX_DEPTH = 10;

const filter = new FilterXSS({ whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: ['script'] });

function sanitizeValue(value: unknown, skip: ReadonlySet<string>, depth: number): unknown {
  if (typeof value === 'string') return filter.process(value);
  if (depth >= MAX_DEPTH || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item, skip, depth + 1));
  const output: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    output[key] = skip.has(key) ? item : sanitizeValue(item, skip, depth + 1);
  }
  return output;
}

export function sanitizeMiddleware(options: { skipFields?: string[] } = {}): RequestHandler {
  const skip = new Set(options.skipFields ?? []);
  return (req, _res, next) => {
    if (req.body !== undefined && req.body !== null) {
      req.body = sanitizeValue(req.body, skip, 0);
    }
    next();
  };
}
