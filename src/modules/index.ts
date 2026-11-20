/**
 * FILE:   src/modules/index.ts
 * LAYER:  composition root
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The registry of feature modules, in mount order. The ONLY line that changes when a
 *   feature is added - app.ts itself stays untouched.
 *
 * WHAT TO WRITE
 *   export const featureModules: FeatureModuleFactory[] = [
 *     createHealthModule,   // unversioned, first
 *     createAuthModule,
 *     // createProjectModule, ...   <- one line per new feature
 *   ];
 *
 * EXPORTS
 *   const featureModules
 *
 * USED BY
 *   src/app.ts   `for (const create of featureModules) { const m = create(shared); app.use(prefix(m), m.router) }`
 *
 * MAY IMPORT
 *   ./types, ./*Module.
 */
export {};
