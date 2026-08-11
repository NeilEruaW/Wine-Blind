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

## V9.4 — UX production
- Continuums SAT à effet « Dock » : valeur sélectionnée agrandie, voisines intermédiaires, autres atténuées.
- Top 10 affiché avant les aides contextuelles.
- Assemblage et « À vérifier » convertis en pastilles compactes et totalement absents s'ils ne sont pas pertinents.
- Hiérarchie Top 1 / Top 2–3 / Top 4–10 et écart Top 1–Top 2.
- Barre de navigation basse flottante inspirée des tab bars iOS, avec icônes vectorielles.
- Icônes sémantiques discrètes pour les phases de dégustation et les aides.
- Thème navigateur synchronisé Rouge/Blanc.

## V9.5 — corrections UX
- Tab bar forcée en bas de l'écran, avec marge de sécurité pour éviter tout chevauchement avec les actions.
- Suppression des cartes introductives Diagnostic cépage, Diagnostic origine, Entraînement et Historique.
- Continuums Dock corrigés : valeurs non sélectionnées réellement réduites et disparition du pavé blanc autour de la sélection.
- Top 3 matérialisé par de petites coupes vectorielles ; suppression du badge plein peu esthétique du rang 1.

## V9.6 — micro-ajustements UX
- Continuums SAT sans libellés F / M− / M / M+ / E sous l’échelle ; la valeur sélectionnée reste affichée dans l’en-tête du critère.
- Les positions du continuum sont représentées par des points de taille progressive.
- Espacement renforcé entre « À vérifier / Assemblage » et « Enregistrer / Affiner l’origine » ; actions rendues non-sticky.
- Suppression des légendes directionnelles Climat, Maturité et Bois dans « Affiner le style ».
