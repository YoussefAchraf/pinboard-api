/**
 * FILE:   src/interface/presenters/UserPresenter.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Maps the User entity to its public JSON shape. Controllers NEVER `res.json(entity)`:
 *   presenters are the whitelist that stops fields like passwordHash from leaking and keep
 *   the API shape independent of the entity's internals.
 *
 * WHAT TO WRITE
 *   export interface IUserResponse {        // must equal the User schema in contracts/openapi/auth.yaml
 *     id: string; email: string; firstname: string; lastname: string;
 *     roleName: Role; status: UserStatus; createdAt: string;   // ISO 8601 UTC string
 *   }
 *   export function presentUser(user: User): IUserResponse { ...explicit field-by-field mapping... }
 *   - Explicit mapping only (no spreading the entity). Dates -> toISOString().
 *   - One presenter file per entity: <Thing>Presenter.ts with present<Thing>().
 *   - List endpoints: `{ items: things.map(presentThing), nextCursor }` (cursor pagination
 *     per contracts/conventions.md).
 *
 * EXPORTS
 *   function presentUser, interface IUserResponse
 *
 * USED BY
 *   interface/controllers/AuthController.ts   login + show responses
 *   future controllers returning users
 *
 * MAY IMPORT
 *   domain/entities/User (type), domain/constants/roles (types).
 */
export {};
