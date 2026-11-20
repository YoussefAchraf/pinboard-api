/**
 * FILE:   scripts/exportSwagger.ts         (npm run docs:export)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   Serializes the OpenAPI spec to docs/openapi.json so it is versioned, diffable, and
 *   checked by the CI "openapi drift" job (stale file = failing PR). Output is deterministic
 *   (object key order of swaggerDefinition.ts, 2-space indent, LF, trailing newline).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { swaggerSpec } from '../src/docs/swaggerDefinition';

const docsDir = join(__dirname, '..', 'docs');
mkdirSync(docsDir, { recursive: true });
writeFileSync(join(docsDir, 'openapi.json'), `${JSON.stringify(swaggerSpec, null, 2)}\n`);
console.log('docs/openapi.json written');
