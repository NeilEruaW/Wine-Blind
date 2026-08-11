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
