/**
 * FILE:   src/modules/index.ts
 * LAYER:  composition root
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   The registry of feature modules, in mount order. The ONLY line that changes when a
 *   feature is added - app.ts itself stays untouched. Unversioned modules (health) are mounted
 *   by app.ts before the global rate limiter, versioned ones after it under /v1.
 *
 * EXPORTS
 *   const featureModules
 *
 * USED BY
 *   src/app.ts
 *
 * MAY IMPORT
 *   ./types, ./*Module.
 */
import { createHealthModule } from './healthModule';
import type { FeatureModuleFactory } from './types';

export const featureModules: FeatureModuleFactory[] = [
  createHealthModule,
  // task 003: createAuthModule
];
