# Block tooling

- `src/blocks/<section>/` : one custom block per page section (block.json, render.php, index.js). Edit these directly.
- `npm run build` : compiles them into `build/blocks/` (commit `build/`, not `node_modules/`).
- `tools/gen-blocks.mjs` : one-off generator that created the blocks from `tools/legacy-patterns/*.php`. Running it again
  OVERWRITES `src/blocks`, so only use it if you want to regenerate from scratch.
- `tools/backup/*.old.html` : the page content from before the conversion (core blocks).
