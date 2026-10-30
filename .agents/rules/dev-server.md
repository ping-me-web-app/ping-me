---
title: Next.js Dev Server After Build
description: Mandatory rule to restart next dev after running next build
trigger: always_on
---

# Dev Server & Build Conflict Rule

Running `next build` (or `npm run build`) overwrites the `.next` directory with production artifacts while `next dev` is running, corrupting the React Client Manifest and Webpack module map.

## Mandatory Procedure:
Every time `npm run build` or `next build` is executed:
1. Kill any existing process on port 3000: `lsof -ti:3000 | xargs -r kill -9`.
2. Start a fresh `npm run dev` background daemon.
3. Check `curl -sI http://localhost:3000/` to ensure it responds with `200 OK`.
