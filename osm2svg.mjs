/* OSM → chemins SVG, projetés en mètres autour du point, palette du site.
   Sortie : un JSON compact injecté ensuite dans index.html. */
import { writeFileSync } from 'node:fs';

const SITES = [
  { key: 'p1', nom: 'Marrakech', lat: 31.637358, lon: -8.003442 },
  { key: 'p2', nom: 'Fès',       lat: 34.050444, lon: -5.018917 }
];

const HALF = 450;                      // demi-côté de la boîte, en mètres
const MPD_LAT = 110540;                // mètres par degré de latitude

const q = (s) => `[out:json][timeout:90];
(
  way["highway"](${s});
  way["building"](${s});
  way["natural"~"^(water|wood|scrub)$"](${s});
  way["landuse"~"^(grass|forest|park|recreation_ground|cemetery|farmland|orchard|vineyard)$"](${s});
  way["leisure"~"^(park|garden|pitch|golf_course)$"](${s});
  way["waterway"](${s});
);
out geom;`;

const BIG = new Set(['motorway','trunk','primary','motorway_link','trunk_link','primary_link']);
const MID = new Set(['secondary','tertiary','secondary_link','tertiary_link']);

function ring(pts, proj, close, dx = 0, dy = 0) {
  let d = '', px = null, py = null;
  for (const p of pts) {
    let [x, y] = proj(p.lon, p.lat);
    x += dx; y += dy;
    if (x === px && y === py) continue;          // points doublons
    d += (d ? 'L' : 'M') + x + ' ' + y;
    px = x; py = y;
  }
  if (!d || d.indexOf('L') < 0) return '';       // segment dégénéré
  return close ? d + 'Z' : d;
}

/* Hauteur du bâti : OSM porte building:levels sur une partie des emprises,
   sinon on retombe sur 2 niveaux. Le décalage vertical simule le volume. */
const LIGHT = { dx: 3, dy: 4 };                  // direction de l'ombre portée
function levels(t) {
  const n = parseFloat(t['building:levels'] ?? t['building:levels:aboveground'] ?? '');
  if (Number.isFinite(n) && n > 0) return Math.min(n, 14);
  const h = parseFloat(t.height ?? '');
  if (Number.isFinite(h) && h > 0) return Math.min(h / 3, 14);
  return 2;
}

function area(pts, proj) {                        // aire approximative, en m²
  let a = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = proj(pts[i].lon, pts[i].lat);
    const [x2, y2] = proj(pts[i + 1].lon, pts[i + 1].lat);
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a / 2);
}

const out = {};

for (const s of SITES) {
  const mpdLon = 111320 * Math.cos(s.lat * Math.PI / 180);
  const dLat = HALF / MPD_LAT, dLon = HALF / mpdLon;
  const bbox = [s.lat - dLat, s.lon - dLon, s.lat + dLat, s.lon + dLon]
    .map(v => v.toFixed(6)).join(',');

  const proj = (lon, lat) => [
    Math.round((lon - s.lon) * mpdLon),
    Math.round(-(lat - s.lat) * MPD_LAT)
  ];

  process.stderr.write(`→ ${s.nom} (${bbox})\n`);
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'XperienceHub-site-builder/1.0'   /* Overpass renvoie 406 sans UA */
    },
    body: 'data=' + encodeURIComponent(q(bbox))
  });
  if (!res.ok) throw new Error(s.nom + ' → HTTP ' + res.status);
  const json = await res.json();

  const road = { big: [], mid: [], small: [] };
  const build = [], buildTop = [], buildShade = [], water = [], green = [];
  let dropped = 0;

  for (const el of json.elements) {
    if (el.type !== 'way' || !el.geometry || el.geometry.length < 2) continue;
    const t = el.tags || {};
    const g = el.geometry;

    if (t.building) {
      if (area(g, proj) < 30) { dropped++; continue; }
      const d = ring(g, proj, true);
      if (!d) continue;
      build.push(d);
      /* le toit est l'emprise décalée vers le haut : l'écart lu entre les deux
         formes fait le mur. Deux chemins fusionnés au lieu de 2 000 facettes. */
      const up = Math.round(levels(t) * 3 * 0.75);
      const top = ring(g, proj, true, 0, -up);   if (top) buildTop.push(top);
      const sh  = ring(g, proj, true, LIGHT.dx, LIGHT.dy); if (sh) buildShade.push(sh);
    } else if (t.natural === 'water' || t.waterway || t.landuse === 'reservoir') {
      const d = ring(g, proj, !!(t.natural === 'water')); if (d) water.push(d);
    } else if (t.landuse || t.leisure || t.natural) {
      const d = ring(g, proj, true); if (d) green.push(d);
    } else if (t.highway) {
      const d = ring(g, proj, false); if (!d) continue;
      if (BIG.has(t.highway)) road.big.push(d);
      else if (MID.has(t.highway)) road.mid.push(d);
      else road.small.push(d);
    }
  }

  out[s.key] = {
    nom: s.nom, lat: s.lat, lon: s.lon, half: HALF,
    roadBig: road.big.join(''), roadMid: road.mid.join(''), roadSmall: road.small.join(''),
    build: build.join(''), buildTop: buildTop.join(''), buildShade: buildShade.join(''),
    water: water.join(''), green: green.join('')
  };

  const kb = (v) => (Buffer.byteLength(v) / 1024).toFixed(1);
  process.stderr.write(
    `   bâti ${build.length} (${dropped} ignorés, ${kb(out[s.key].build)} Ko) · ` +
    `voirie ${road.big.length}/${road.mid.length}/${road.small.length} (${kb(out[s.key].roadSmall)} Ko) · ` +
    `eau ${water.length} · vert ${green.length}\n`
  );
}

writeFileSync(process.argv[2], JSON.stringify(out));
process.stderr.write('total ' + (Buffer.byteLength(JSON.stringify(out)) / 1024).toFixed(1) + ' Ko\n');
