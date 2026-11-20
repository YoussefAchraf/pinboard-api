/**
 * FILE:   tests/fixtures/makeUser.ts
 * LAYER:  tests (relaxed lint)
 * STATUS: placeholder - implement with the first use-case unit test.
 *
 * PURPOSE
 *   Object mother: a valid User with sensible defaults; tests override only what matters.
 *
 * WHAT TO WRITE
 *   export function makeUser(overrides: Partial<IUserProps> = {}): User {
 *     return new User({ id: 'user-1', email: 'member@example.test', passwordHash: '<hash>',
 *                       firstname: 'Test', lastname: 'User', roleName: ROLES.MEMBER,
 *                       status: USER_STATUS.ACTIVE, createdAt: new Date('2026-01-01T00:00:00Z'),
 *                       updatedAt: new Date('2026-01-01T00:00:00Z'), ...overrides });
 *   }
 *   - Fixed dates/ids (deterministic). Use the reserved `.test` TLD for emails.
 *   Pattern for every entity: tests/fixtures/make<Thing>.ts
 */
export {};
