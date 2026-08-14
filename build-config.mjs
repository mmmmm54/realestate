/* Vercel build step.
   Assembles a dist/ folder containing only what the live site needs, and
   writes config.js from the MAPBOX_TOKEN environment variable so the token
   never has to live in the git repo.

   Local development does not use this — there, config.js is created by hand
   from config.example.js and the site is served straight from the repo root. */
import { mkdirSync, rmSync, cpSync, copyFileSync, writeFileSync, existsSync } from 'node:fs';

const OUT = 'dist';

/* Only these are served. Everything else — the build scripts, the README,
   the OSM tooling, the video masters — stays out of the deployment. */
const FILES = ['index.html'];
const DIRS  = ['medias'];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const f of FILES) {
  if (!existsSync(f)) throw new Error(`Missing required file: ${f}`);
  copyFileSync(f, `${OUT}/${f}`);
}

for (const d of DIRS) {
  if (!existsSync(d)) throw new Error(`Missing required directory: ${d}`);
  cpSync(d, `${OUT}/${d}`, { recursive: true });
}

const token = process.env.MAPBOX_TOKEN || '';
if (!token) {
  console.warn(
    'MAPBOX_TOKEN is not set. Deploying without it — the site still works, ' +
    'the satellite map falls back to the generated vector map.'
  );
}
writeFileSync(`${OUT}/config.js`,
  `window.MAALEM_CONFIG = {\n  mapboxToken: ${JSON.stringify(token)}\n};\n`);

console.log(`Built ${OUT}/ ${token ? 'with' : 'without'} a Mapbox token.`);
