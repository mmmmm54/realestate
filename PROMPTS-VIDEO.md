# Expérience GeoSignature 3D — prompts de génération vidéo

Ce fichier sert à produire les vidéos du site. Il est écrit à partir de ce qui a été
constaté sur `Neo_Square_Final.wt.mp4` (1080×1920, 55,2 s, 46 Mo).

---

## 0. À lire avant de générer

**Ce que l'IA vidéo sait faire :** le terrain, la descente aérienne, la lumière, la
masse du bâtiment qui sort du sol, l'ambiance.

**Ce qu'elle ne sait pas faire :** du texte lisible. Aucun générateur ne produit
« 2 371 m² », « 8 min voiture » ou « 62,4 m » sans les déformer. Toute la
typographie, les cotes, les temps de trajet, les pastilles POI et les traits
d'itinéraire se posent **après**, en compositing (After Effects, Resolve, ou même
CapCut pour un cut rapide).

Donc : deux couches.

| Couche | Contenu | Outil |
|---|---|---|
| A — Fond | terrain, descente, volume 3D, lumière | générateur IA |
| B — Habillage | chiffres, cotes, routes, POI, logo | After Effects / Resolve |

Les prompts ci-dessous ne concernent que la **couche A**.

---

## 1. Trois défauts à corriger sur le cut actuel

Constatés en branchant `Neo_Square_Final.wt.mp4` dans le hero :

1. **L'image est bleue.** L'imagerie satellite brute tire vers le cyan et se bat
   avec la palette anthracite + or. Le site corrige à la volée via le jeton
   `--grade` dans `index.html`, mais mieux vaut étalonner à la source.
2. **Le logo est incrusté au milieu du cadre.** Il tombe sur le bouton
   « Voir les travaux ». Le site affiche déjà la marque en haut à gauche :
   le master destiné au web doit être **propre, sans logo incrusté**.
   Gardez la version brandée pour WhatsApp et les stories.
3. **46 Mo pour 55 s.** Sur données mobiles, le hero ne s'affichera pas.
   Cible : voir §6.

---

## 2. Spécifications par emplacement

| Emplacement | Format | Durée | Poids cible | Zone à garder libre |
|---|---|---|---|---|
| Hero desktop | 1920×1080 (16:9) | 14–18 s | ≤ 4 Mo | bas-gauche (titre) + bas-droite (index) |
| Hero mobile | 1080×1920 (9:16) | 14–18 s | ≤ 3,5 Mo | moitié basse (titre + boutons + index) |
| Reel projet ×6 | 1080×1920 (9:16) | 8–12 s | ≤ 2,5 Mo | haut-gauche (nom) + bas (chiffres) |
| Poster | 1280×720 JPEG q80 | — | ≤ 120 Ko | — |

**Boucle :** les vidéos tournent en `loop`. Premier et dernier plan doivent
raccorder. Le plus simple : terminer sur le volume 3D fixe pendant 1,5 s, et
démarrer sur un fond ciel/orbite sombre — la coupure passe inaperçue.

**Cadence :** 25 ou 30 fps. Pas de 60 — poids doublé pour rien.

---

## 3. Prompt maître (gabarit)

Remplacez ce qui est entre crochets.

```
Cinematic aerial descent over [TYPE DE SITE], filmed as one continuous
uninterrupted camera move. Opens from high orbital altitude looking straight
down, then descends smoothly and accelerates toward a single rectangular plot
of empty land at the centre of frame. The camera tilts from top-down to a low
oblique angle as it arrives. Final third: a clean modern residential building
volume rises out of the empty plot, growing from the ground upward at real
scale, [HAUTEUR] storeys, flat roof, simple geometric massing, no ornament.

Look: desaturated anthracite and charcoal terrain, cool grey concrete, dark
asphalt, muted olive vegetation. Single warm gold accent light. High contrast,
deep shadows, crisp architectural clarity. Overcast diffused daylight, no harsh
sun flare. Photoreal satellite-to-drone transition, shallow atmospheric haze at
altitude clearing as it descends.

Camera: slow steady descent, no handheld shake, no whip pans, constant speed,
locked horizon. Motion should feel mechanical and precise, like a surveying
instrument.
```

---

## 4. Prompts prêts à l'emploi

### Hero — 16:9 desktop

```
Cinematic aerial descent over a dense North African coastal city, filmed as one
continuous uninterrupted camera move. Opens from high orbital altitude looking
straight down at the coastline, then descends smoothly and accelerates toward a
single rectangular empty plot of land between low white buildings. The camera
tilts from top-down to a low oblique angle as it arrives. Final third: a clean
modern residential building volume rises out of the empty plot, growing upward
at real scale, six storeys, flat roof, simple geometric massing.

Look: desaturated anthracite and charcoal terrain, cool grey concrete, dark
asphalt, muted olive vegetation, deep navy sea reading almost black. Single warm
gold accent light catching the plot edges. High contrast, deep shadows, crisp
architectural clarity. Overcast diffused daylight. Photoreal satellite-to-drone
transition, atmospheric haze at altitude clearing as it descends.

Camera: slow steady descent, no shake, constant speed, locked horizon, precise
and mechanical like a surveying instrument. Wide 16:9 framing, subject centred
slightly high in frame, lower third kept clear and uncluttered.
```

> Le « lower third kept clear » n'est pas cosmétique : c'est là que se posent le
> titre et les boutons.

### Hero — 9:16 mobile

Même prompt, en remplaçant la dernière phrase par :

```
Camera: slow steady descent, no shake, constant speed, locked horizon, precise
and mechanical. Vertical 9:16 framing, the plot centred in the UPPER THIRD of
the frame, bottom half of the frame kept visually calm and uncluttered.
```

### Reels projets — une variante par terrain

Reprenez le gabarit du §3 et changez la première ligne :

| Projet | `[TYPE DE SITE]` | `[HAUTEUR]` |
|---|---|---|
| Résidence Al Bahia | `a beachfront strip of a North African city, wide sandy shoreline on one side` | six |
| Marina Bloc C | `a modern marina district, yacht basin and breakwater visible` | eight |
| Domaine Zenata | `a flat coastal development zone, new road grid drawn on empty land` | five |
| Les Terrasses Anfa | `an affluent hillside residential district, mature trees and low villas` | four |
| Villa Dar Bouazza | `a low-density seaside suburb, scattered villas and walled gardens` | two |
| Parc Bouskoura | `a golf resort edge, fairways and irrigation lakes beside open land` | six |

---

## 5. Prompt négatif

À coller dans le champ prévu (Kling, Runway) ou à ajouter en fin de prompt
(Veo, Sora, qui n'ont pas de champ dédié) :

```
text, letters, numbers, captions, subtitles, watermark, logo, UI overlay, HUD,
map pins, floating labels, people, cars in motion, birds, lens flare, light
leaks, chromatic aberration, oversaturated colours, teal and orange grade, blue
cast, cyan water, tilt-shift miniature effect, fisheye distortion, handheld
shake, whip pan, jump cut, scene change, split screen, vignette, film grain
```

`text, letters, numbers` en tête est le plus important : sans ça, la plupart des
modèles inventent des faux labels illisibles sur le terrain.

---

## 6. Réglages par outil

| Outil | Durée max | Remarque |
|---|---|---|
| **Veo 3** | 8 s | Le meilleur sur la descente aérienne continue. Pas de champ négatif : ajoutez `Avoid: [liste §5]` en fin de prompt. Générez 2 plans de 8 s et raccordez. |
| **Kling 2.x** | 10 s | Champ négatif dédié. Mode « Professional ». Baissez la *creativity* à ~0,3 : au-delà il invente des bâtiments parasites. |
| **Runway Gen-4** | 10 s | Meilleur en image-to-video : partez d'une capture Google Earth de la vraie parcelle, vous gardez la géographie réelle. C'est l'option la plus juste pour un vrai client. |
| **Sora** | 20 s | La plus longue durée d'un seul tenant, donc le meilleur choix pour le hero. Décrivez le mouvement en une seule phrase continue, il gère mal les listes. |

**Recommandation :** pour un vrai projet vendu à un promoteur, l'IA seule ne
suffira pas — elle ne connaît pas la parcelle réelle. Le circuit juste reste
**Google Earth Studio** (trajet caméra exact depuis les coordonnées GPS) +
**After Effects** pour l'habillage. L'IA est parfaite pour le hero du site, les
plans d'ambiance et les démos commerciales.

---

## 6 bis. Le timelapse de fond (étape 5 « Extrusion »)

Il ne se déclenche qu'à la cinquième couche : les quatre couches analytiques
restent sur fond vectoriel calme, puis le terrain s'anime au moment où le volume
sort du sol. Fichier absent → la démo reste vectorielle, rien ne casse.

### La règle non négociable

**Caméra strictement fixe.** Les incrustations — cotes, POI, parcelle — sont
calées au sol. Si la caméra bouge d'un pixel, tout le calage saute. Aucun
travelling, aucun zoom, aucun parallaxe, aucun mouvement de drone.

C'est le réflexe par défaut de tous les générateurs : sans consigne explicite,
ils ajoutent un mouvement de caméra. Il faut l'interdire deux fois — dans le
prompt et dans le négatif.

### Étape 1 — l'image de départ

Générez d'abord une **image fixe**, puis animez-la (image-to-video). C'est le
seul moyen de garder le cadre verrouillé.

**Marrakech (site 1) :**

```
Elevated static aerial view of an empty rectangular plot of bare earth in a
dense low-rise North African medina. Flat ochre rooftops and narrow streets
surround the plot on all sides. One wider access road runs along the lower
edge. Shot from about 150 metres altitude, camera looking down at roughly 55
degrees, horizon line high in the frame with visible sky and scattered clouds.

The empty plot sits dead centre, occupying about one third of the frame, clearly
readable as bare ground with no construction on it.

Look: desaturated anthracite and warm grey, dusty ochre walls reading almost
monochrome, dark asphalt, deep shadows, low overall contrast, soft overcast
light. Muted, filmic, no vivid colours.
```

**Fès (site 2)** — remplacez la première phrase par :

```
Elevated static aerial view of an empty rectangular plot on the outskirts of a
North African city, surrounded by open farmland, olive groves and a new road
grid drawn on undeveloped land. Low hills on the horizon.
```

Points à ne pas perdre : **la parcelle vide au centre**, **du ciel visible**
(sans ciel, pas de nuages à animer), et **un contraste bas**.

### Étape 2 — l'animation

Reprenez l'image dans un outil image-to-video avec :

```
Time-lapse. The camera is completely static, locked off on a tripod. Nothing in
the frame moves except: clouds drifting across the sky, shadows of buildings
sweeping slowly across the ground as the sun moves, and long-exposure car light
trails on the access road. The empty plot stays perfectly still and empty.
```

Négatif :

```
camera movement, camera pan, zoom, dolly, tracking shot, crane, drone move,
parallax, handheld, shake, scene change, cut, people, construction, buildings
appearing, text, letters, numbers, watermark, logo, high contrast, vivid colours
```

### Étape 3 — spécifications

| | Desktop | Mobile |
|---|---|---|
| Fichier | `medias/timelapse-16x9.mp4` | `medias/timelapse-9x16.mp4` |
| Format | 1600×900 | 720×1280 |
| Durée | 6 à 10 s, en boucle | idem |
| Poids cible | ≤ 1,2 Mo | ≤ 0,9 Mo |

Deux cuts sont nécessaires : la démo est plein écran aux deux tailles, un seul
fichier 16:9 serait rogné des deux tiers sur mobile.

**Boucle :** faites correspondre première et dernière image, ou générez un
aller-retour. Une coupe visible dans un fond qui tourne en boucle se remarque
tout de suite.

Le site écrase déjà l'image (`brightness(.6) contrast(.88)` en plus de
l'étalonnage) pour que les cotes blanches restent lisibles — inutile de
l'assombrir à la source.

Encodage :

```bash
ffmpeg -i timelapse_master.mp4 -t 8 -an -vf "hqdn3d=3:3:6:6,scale=1600:900:flags=lanczos,fps=25" -c:v libx264 -crf 31 -preset veryslow -profile:v main -pix_fmt yuv420p -movflags +faststart medias/timelapse-16x9.mp4
```

---

## 7. Compression

Cible : 55 s → **~4 Mo**. Avec ffmpeg :

```bash
ffmpeg -i hero_master.mp4 -t 16 -vf "scale=1080:1920" -c:v libx264 -crf 30 -preset slow -profile:v main -pix_fmt yuv420p -movflags +faststart -an hero.mp4
```

- `-t 16` coupe à 16 s. Une boucle de 16 s pèse 3,5× moins qu'un cut de 55 s.
- `-an` supprime la piste audio : le hero est muet, l'audio ne sert à rien
  tant que le bouton son n'est pas activé. Gardez une version avec son pour le
  cadre projet.
- `-movflags +faststart` : indispensable, sinon la lecture ne démarre qu'une fois
  le fichier entier chargé.
- `-crf 30` est agressif mais tient sur une image sombre et désaturée. Si ça
  bave dans les dégradés du ciel, descendez à 26.

Version WebM optionnelle (~30 % plus légère sur Chrome/Android) :

```bash
ffmpeg -i hero_master.mp4 -t 16 -c:v libvpx-vp9 -crf 36 -b:v 0 -an hero.webm
```

Poster :

```bash
ffmpeg -i hero.mp4 -ss 12 -frames:v 1 -q:v 6 poster-hero.jpg
```

---

## 8. Brancher les fichiers dans le site

### État actuel (compressé et branché)

| Fichier servi | Définition | Durée | Poids | Emplacement |
|---|---|---|---|---|
| `medias/hero-16x9.mp4` | 1600×900 | 8 s | 3,24 Mo | hero desktop |
| `medias/hero-9x16.mp4` | 720×1280 | 16 s | 2,61 Mo | hero mobile |
| `medias/p1-reel.mp4` | 720×1280 | 55 s | 7,76 Mo | reel projet 1 |
| `medias/p1-16x9.mp4` | 1280×720 | 8 s | 1,16 Mo | cut 16:9 projet 1 |
| 3 posters `.jpg` | — | — | 0,38 Mo | images d'attente |

**81 Mo → 15 Mo**, dont seulement 2,6 Mo (mobile) ou 3,2 Mo (desktop) chargés à
l'arrivée : le reste est en chargement paresseux. Les masters d'origine sont
dans `masters/`, hors du dossier servi — ne les mettez pas en ligne.

Recette retenue : débruitage `hqdn3d`, 25 fps, définition ramenée à l'affichage
réel, CRF 30, `+faststart`. Le grain de la génération IA était le premier poste
de débit ; le débruitage seul a divisé le poids par deux.

**Deux corrections de contenu** sur le film vertical : logo incrusté au milieu du cadre
et pastilles « m² » incrustées sur le terrain. Les deux entrent en collision avec
la typographie du site, qui pose déjà sa propre marque et ses propres cotes. Le
master web doit être **nu** — gardez la version habillée pour WhatsApp.

### Champs de configuration


Tout se passe dans le bloc de configuration en haut du `<script>` de
`index.html`.

Hero :

```html
<video id="heroVideo" ... data-src="medias/hero-16x9.mp4"
                          data-src-mobile="medias/hero-9x16.mp4"></video>
```

Projets :

```javascript
{ id:'p1', nom:'Résidence Al Bahia', ..., video:'medias/p1-16x9.mp4',
                                          reel:'medias/p1-9x16.mp4',
                                          poster:'medias/p1-poster.jpg' },
```

- `video` = cut 16:9, utilisé sur desktop · `reel` = cut 9:16, utilisé sur mobile.
- Un champ laissé vide affiche la carte de démonstration générée — le site ne
  paraît jamais cassé.
- Si votre master est déjà étalonné anthracite, désactivez la correction du site :
  `--grade:none` dans le `:root` de la feuille de style.
