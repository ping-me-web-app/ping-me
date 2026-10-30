<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Development Server & Build Rules

- **Next.js Dev Server vs. Build Conflict**: Running `next build` (or `npm run build`) overwrites the `.next` directory with production artifacts while `next dev` is active, corrupting Webpack chunks and the React Client Manifest (`TypeError: __webpack_modules__[moduleId] is not a function`).
- **MANDATORY RULE**: Whenever you run `next build` or `npm run build`, you MUST immediately restart the development server on port 3000 afterwards:
  1. Kill the stale dev server process on port 3000 (`lsof -ti:3000 | xargs -r kill -9`).
  2. Rerun `npm run dev` in the background (as a daemon).
  3. Verify that `http://localhost:3000` responds with `200 OK`.
