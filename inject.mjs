/* Injecte geo.json dans index.html à l'emplacement du marqueur @GEO. */
import { readFileSync, writeFileSync } from 'node:fs';

const [, , htmlPath, jsonPath] = process.argv;
const html = readFileSync(htmlPath, 'utf8');
const geo = readFileSync(jsonPath, 'utf8').trim();

const marker = /var GEO = \{[\s\S]*?\}; \/\* @GEO \*\//;
if (!marker.test(html)) throw new Error('marqueur @GEO introuvable');

const next = html.replace(marker, 'var GEO = ' + geo + '; /* @GEO */');
writeFileSync(htmlPath, next);

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1);
console.log(`injecté ${kb(geo)} Ko · index.html ${kb(html)} → ${kb(next)} Ko`);
