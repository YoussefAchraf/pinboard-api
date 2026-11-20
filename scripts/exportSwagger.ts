/**
 * FILE:   scripts/exportSwagger.ts         (npm run docs:export)
 * STATUS: placeholder - implement with the first documented route.
 *
 * PURPOSE
 *   Serializes the OpenAPI spec to docs/openapi.json so it is versioned, diffable, and
 *   checked by the CI "openapi drift" job (stale file = failing PR).
 *
 * WHAT TO WRITE
 *   import { mkdirSync, writeFileSync } from 'node:fs';
 *   import { swaggerSpec } from '../src/docs/swaggerDefinition';
 *   mkdirSync('docs', { recursive: true });
 *   writeFileSync('docs/openapi.json', `${JSON.stringify(swaggerSpec, null, 2)}\n`);
 *   console.log('docs/openapi.json written');
 *   - Deterministic output (stable key order, trailing newline) so the drift check is reliable.
 */
export {};
