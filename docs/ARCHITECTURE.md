# Architecture V11.6.0

## Runtime

- `index.html` — shell PWA historique restauré.
- `styles.css` — stylesheet historique V10.7.2, conservé intact.
- `v11-reset.css` — uniquement les ajustements UX V11.
- `app.js` — application historique V10.7.2, conservée intacte.
- `data.js` — référentiel historique utilisé par quiz, recherche, historique et métadonnées.
- `v106.js` — appellations / assemblages historiques.
- `v107.js` — régions et profils géographiques historiques.
- `v108.js` — unités diagnostiques / contenu pédagogique historique.
- `tree.js` — arbre guidé historique.
- `c2c2-data.js` — candidate Wine-Blind-vNext-C2-C2 gelée.
- `c2c2-engine.js` — scoring C2-C2.
- `canonical-probability-model.js` — vraisemblances cépages sur les 98 identités canoniques.
- `origin-probability-model.js` — modèle hiérarchique `P(cépage) × P(profil régional | cépage)` et calibration selon la quantité de preuves.
- `v11-reset-patch.js` — pont entre l'interface historique et C2-C2.
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA.

## Choix d'organisation

Les scripts runtime restent à la racine afin de préserver les chemins éprouvés de la PWA historique et de minimiser le risque de régression. Les documents de release sont regroupés dans `docs/`.

Les fichiers de benchmark, audits, modèles JSON doublons, tests de développement et assets des anciennes releases ne font pas partie de l'arbre de production.
