# MAALEM معالم

Site vitrine d'un service de films 3D pour l'immobilier : une épingle GPS et
des photos de terrain deviennent un film qui situe, mesure et projette un
projet avant sa construction.

Trois langues (FR · EN · AR avec bascule droite-à-gauche), carte Mapbox en
globe, démonstration du format pilotée au défilement, lecteur vertical.

---

## Lancer le site

Il faut **Node.js 18 ou plus**. Aucune installation de dépendances.

Copiez d'abord le fichier de configuration et renseignez votre jeton Mapbox :

```bash
cp config.example.js config.js
```

Puis lancez le serveur :

```bash
node serve.mjs
```

Puis ouvrir `http://localhost:5173`.

Le serveur écoute aussi sur le réseau local : l'adresse affichée au démarrage
(`http://192.168.x.x:5173`) permet d'ouvrir le site **depuis un téléphone sur
le même Wi-Fi**. C'est le seul moyen de tester le rendu réel sur iOS, et c'est
de là que viendra l'essentiel du trafic.

> Ouvrir `index.html` directement en double-cliquant fonctionne aussi, mais
> sans les requêtes de plage : on ne peut pas se déplacer dans les vidéos et
> Safari refuse parfois de les lire. Préférez le serveur.

---

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | **Tout le site** — structure, styles, scripts, traductions, géométrie |
| `serve.mjs` | Serveur statique local (requêtes de plage pour les vidéos) |
| `medias/` | Vidéos compressées, posters, logo, image de partage |
| `osm2svg.mjs` | Régénère la géométrie cartographique depuis OpenStreetMap |
| `inject.mjs` | Injecte cette géométrie dans `index.html` |
| `PROMPTS-VIDEO.md` | Prompts de génération des films et commandes d'encodage |

Le site est un fichier unique volontairement. Tout se configure en haut du
`<script>`, dans des constantes commentées.

---

## Ce qu'il faut changer

Une check-list complète figure en commentaire tout en haut d'`index.html`.
L'essentiel :

1. **`WHATSAPP`** — le numéro. Six boutons du site y mènent ; tant qu'il est
   faux, chaque prospect est perdu au moment où il veut écrire.
2. **Le domaine**, quatre fois dans le `<head>` (`canonical`, `og:url`,
   `og:image`, `twitter:image`). WhatsApp et Facebook refusent les chemins
   relatifs : sans URL absolue correcte, le lien partagé n'affiche aucun aperçu.
3. **`MAPBOX_TOKEN`** — voir l'avertissement ci-dessous.
4. Les vrais e-mail, téléphone et adresse, section Contact.
5. **`PROJETS`** — un seul projet a un film aujourd'hui, les autres affichent
   « Bientôt ». Un projet sans `lat`/`lon` n'obtient pas d'épingle sur la carte
   satellite, volontairement : une fausse épingle se repère au premier zoom.
6. **`CLIENTS`** et **`TEMOIGNAGE`** — emplacements vides. Le témoignage reste
   masqué tant que `actif` vaut `false`. N'inventez ni nom ni citation.

---

## ⚠️ Jeton Mapbox

Le jeton vit dans **`config.js`, qui est exclu du dépôt** — il n'entre jamais
dans Git. C'est `config.example.js` qui est versionné, avec un champ vide.

Une fois le site en ligne, le jeton devient forcément visible dans la page :
c'est normal pour un jeton public `pk.`, tous les sites Mapbox exposent le leur.
**Mais il doit être restreint au domaine** dans *Account → Tokens →
URL restrictions*. Sans restriction, n'importe qui peut le copier et consommer
le quota gratuit (50 000 chargements/mois) sur le compte du propriétaire.

**N'utilisez jamais un jeton secret `sk.` ici.**

Si le jeton est absent ou refusé, le site retombe automatiquement sur une carte
vectorielle générée : rien ne casse.

---

## Régénérer la géométrie cartographique

Les fonds de carte vectoriels viennent d'OpenStreetMap et sont figés dans
`index.html`. Pour ajouter des villes, éditez le tableau `SITES` en tête
d'`osm2svg.mjs`, puis :

```bash
node osm2svg.mjs geo.json && node inject.mjs index.html geo.json
```

---

## Vidéos

Recette d'encodage et prompts de génération dans `PROMPTS-VIDEO.md`.

Les masters d'origine (81 Mo) ne sont **pas** dans le dépôt : seuls les
fichiers compressés de `medias/` sont livrés, soit 15 Mo au total dont 2,6 Mo
seulement chargés à l'arrivée sur mobile.

---

## Crédits

Fonds cartographiques © contributeurs [OpenStreetMap](https://www.openstreetmap.org/copyright)
(ODbL) · Imagerie satellite © Mapbox · Caractères : Alexandria, Satoshi,
IBM Plex Mono.
