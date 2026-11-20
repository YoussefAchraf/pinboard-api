/**
 * FILE:   src/domain/constants/roles.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The role catalog and the user-status catalog. Authorization decisions reference these
 *   constants - never string literals sprinkled through use cases (Open/Closed principle:
 *   a new role = one line here + policy, not new `if (role === ...)` branches).
 *
 * WHAT TO WRITE
 *   export const ROLES = { ADMIN: 'admin', MEMBER: 'member' } as const;   // template default
 *   export type Role = (typeof ROLES)[keyof typeof ROLES];
 *   export const USER_STATUS = { ACTIVE: 'active', DISABLED: 'disabled' } as const;
 *   export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
 *   - Project-specific roles are decided by the manager in contracts/domain-model.md
 *     and added here; the frontend mirrors them in rt-fe/src/shared/types.
 *
 * EXPORTS
 *   const ROLES, type Role, const USER_STATUS, type UserStatus
 *
 * USED BY
 *   domain/entities/User.ts                          (field types, hasRole / isActive)
 *   interface/middlewares/requireRoleMiddleware.ts   `requireRole(ROLES.ADMIN)`
 *   interface/validation/*Schemas.ts                 `z.enum([ROLES.ADMIN, ROLES.MEMBER])`
 *   scripts/seedAdmin.ts                             (creates the first ROLES.ADMIN user)
 *
 * MAY IMPORT
 *   Nothing.
 */
export {};
