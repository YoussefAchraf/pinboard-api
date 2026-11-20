/**
 * FILE:   src/interface/middlewares/sanitizeMiddleware.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Defense in depth against stored XSS: strips HTML from incoming string fields. zod
 *   validation remains the primary input contract; output encoding is the frontend's job.
 *
 * WHAT TO WRITE
 *   export function sanitizeMiddleware(options?: { skipFields?: string[] }): RequestHandler
 *     -> recursively walk req.body (objects/arrays, bounded depth, e.g. 10) and replace every
 *        string with xss.filterXSS(value, { whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: ['script'] })
 *     -> never touch fields listed in skipFields (e.g. 'password' - must reach the hasher unchanged)
 *   - Do NOT mutate req.query in Express 5 (it is a getter); sanitize the body only and
 *     validate query/params with zod.
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
export {};
