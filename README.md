# Wine Blind — PWA V9

V9 centrée sur :
- détection légère des assemblages à partir du Top 10 cépages ;
- 2–3 appellations compatibles sous chaque candidat du Top 10 Origine ;
- niveau de précision origine/appellation, sans créer un Top 10 Appellations supplémentaire ;
- fiches cépages enrichies avec appellations/zones clés et associations d'assemblage.

La couche V10.6 est dans `v106.js`. Toutes les fonctions V8 sont conservées.
Pour GitHub Pages : remplace les fichiers du dépôt par le contenu de cette archive.
Le cache du service worker est incrémenté en V9 pour faciliter la mise à jour sur iPhone.

## V9.1
- Appellations filtrées strictement par région mère avant scoring.
- Score global mis en avant, Cépage/Style en sous-scores.
- Assemblage affiché uniquement s'il est compatible avec l'origine ouverte.
- Indice de précision retiré.
- Associations cépage compactées en badges.

## V9.2
- Appellations des fiches cépages séparées en Monocépage / Assemblages.
- Suppression de la limite de 24 associations dans la couche de données.
- Correction de complétude : Cornas est notamment présent dans la fiche Syrah.
- Recherche référentiel étendue aux appellations, assemblages, régions, arômes, marqueurs, confusions et autres champs de fiche.
- Le sous-titre d'un résultat indique le contexte du match (ex. « Monocépage · Cornas »).

## V9.3 — présentation / UX
- Suppression de la mention WSET · Blind tasting.
- Thème rouge conservé ; thème blanc en palette jaune/dorée.
- Marqueurs complémentaires allégés ; Signature déplacée après Fruit et Texture/élevage.
- Encadré assemblage réellement masqué en l'absence de détection.
- Comparaison via icône ⇄ sur chaque candidat et ouverture automatique dès 2 candidats sélectionnés (3 maximum).
- Suppression du bouton intermédiaire « Comparer X candidats ».
- Référentiel : suppression de l'encart introductif, accès immédiat à la recherche.
