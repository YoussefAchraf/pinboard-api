/**
 * FILE:   src/interface/validation/authSchemas.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   zod schemas for every auth endpoint payload. They must match
 *   contracts/openapi/auth.yaml exactly (same fields, same constraints).
 *
 * WHAT TO WRITE
 *   export const loginSchema = z.object({
 *     email: z.string().trim().toLowerCase().email().max(254),
 *     password: z.string().min(8).max(128),
 *   }).strict();
 *   export type LoginBody = z.infer<typeof loginSchema>;
 *   - refresh / logout / whoami have no body (cookies only) - no schema needed.
 *   - One file per feature: <feature>Schemas.ts, named exports <action>Schema.
 *
 * EXPORTS
 *   const loginSchema, type LoginBody
 *
 * USED BY
 *   interface/routes/authRoutes.ts   `deps.validate({ body: loginSchema })`
 *   docs/authDocs.ts                 keep the OpenAPI request schema in sync (manually or via a zod->openapi helper)
 *
 * MAY IMPORT
 *   zod only.
 */
export {};
