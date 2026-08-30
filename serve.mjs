/* Serveur statique local pour prévisualiser le site.
   node serve.mjs [port]
   Gère les requêtes de plage (Range) : sans elles, on ne peut pas se déplacer
   dans les vidéos et Safari refuse parfois de les lire. */
import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { networkInterfaces } from 'node:os';

const ROOT = process.cwd();
/* PORT d'abord : c'est par cette variable que l'outil d'aperçu attribue un
   port libre. Sans elle, un serveur oublié d'une session précédente garde
   5173 et le démarrage échoue. L'argument reste accepté pour lancer à la main
   sur un port choisi — pratique pour tester depuis le téléphone. */
const PORT = Number(process.env.PORT || process.argv[2] || 5173);

const TYPES = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml',
  '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.webp':'image/webp',
  '.mp4':'video/mp4', '.webm':'video/webm', '.woff2':'font/woff2', '.ico':'image/x-icon'
};

createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/' || p.endsWith('/')) p += 'index.html';

  /* on ne sort jamais du dossier du projet */
  const file = join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(ROOT) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8' });
    return res.end('404 — ' + p);
  }

  const { size } = statSync(file);
  const type = TYPES[extname(file).toLowerCase()] || 'application/octet-stream';
  const range = req.headers.range;

  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const start = m[1] ? parseInt(m[1], 10) : 0;
    const end   = m[2] ? parseInt(m[2], 10) : size - 1;
    if (start >= size) {
      res.writeHead(416, { 'Content-Range': `bytes */${size}` });
      return res.end();
    }
    res.writeHead(206, {
      'Content-Type': type,
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Cache-Control': 'no-cache'
    });
    return createReadStream(file, { start, end }).pipe(res);
  }

  res.writeHead(200, {
    'Content-Type': type, 'Content-Length': size,
    'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache'
  });
  createReadStream(file).pipe(res);
}).listen(PORT, '0.0.0.0', () => {
  const lan = Object.values(networkInterfaces()).flat()
    .filter(i => i && i.family === 'IPv4' && !i.internal).map(i => i.address);
  console.log(`Local    http://localhost:${PORT}`);
  lan.forEach(a => console.log(`Téléphone  http://${a}:${PORT}   (même Wi-Fi)`));
});
