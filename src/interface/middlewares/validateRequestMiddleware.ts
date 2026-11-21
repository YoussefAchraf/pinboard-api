/**
 * FILE:   src/interface/middlewares/validateRequestMiddleware.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   Applies the zod schemas of an endpoint (body / params / query) before the controller.
 *   Controllers then receive already-validated, typed input.
 *   - Failure -> AppError 422 VALIDATION_FAILED with `details.fields` = { "<path>": "<i18n key>" }
 *     (first issue per field). Keys: validation.required (value missing), validation.too_big,
 *     validation.too_small, validation.email, validation.url, validation.invalid_format,
 *     validation.invalid_type, otherwise validation.<zod issue code>. A failure on the whole part
 *     uses the part name ('body', 'query', 'params') as the field.
 *   - body: `req.body = parsed` (unknown keys stripped by default object schemas).
 *     params/query: parsed values in `res.locals.validated.{params,query}` (Express 5 req.query is
 *     read-only).
 *
 * EXPORTS
 *   function validate, interface IRequestSchemas
 *
 * USED BY
 *   src/app.ts (shared.http.validate) -> src/modules/*Module.ts -> interface/routes/*Routes.ts
 *
 * MAY IMPORT
 *   express (types), zod (types), domain/errors/*.
 */
import type { RequestHandler } from 'express';
import type { ZodType, core } from 'zod';
import { AppError } from '../../domain/errors/AppError';

export interface IRequestSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

type TPart = keyof IRequestSchemas;

function valueAt(input: unknown, path: ReadonlyArray<PropertyKey>): unknown {
  let current: unknown = input;
  for (const segment of path) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<PropertyKey, unknown>)[segment];
  }
  return current;
}

function i18nKey(issue: core.$ZodIssue, input: unknown): string {
  switch (issue.code) {
    case 'invalid_type':
      return valueAt(input, issue.path) === undefined ? 'validation.required' : 'validation.invalid_type';
    case 'invalid_format':
      return issue.format === 'email' || issue.format === 'url'
        ? `validation.${issue.format}`
        : 'validation.invalid_format';
    default:
      return `validation.${issue.code}`;
  }
}

function toFields(issues: core.$ZodIssue[], input: unknown, part: TPart): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of issues) {
    const field = issue.path.length > 0 ? issue.path.map(String).join('.') : part;
    fields[field] ??= i18nKey(issue, input);
  }
  return fields;
}

export function validate(schemas: IRequestSchemas): RequestHandler {
  return (req, res, next) => {
    const validated: Partial<Record<'params' | 'query', unknown>> = {};
    const fields: Record<string, string> = {};

    for (const part of ['params', 'query', 'body'] as const) {
      const schema = schemas[part];
      if (!schema) continue;
      const input: unknown = req[part];
      const result = schema.safeParse(input);
      if (!result.success) {
        Object.assign(fields, toFields(result.error.issues, input, part));
      } else if (part === 'body') {
        req.body = result.data;
      } else {
        validated[part] = result.data;
      }
    }

    if (Object.keys(fields).length > 0) {
      next(AppError.validation('Invalid request', { fields }));
      return;
    }
    res.locals['validated'] = validated;
    next();
  };
}
