# Wine Blind — prototype PWA

Prototype mobile construit à partir de **WSET4_matrice_cepages_V9_propre_v2.xlsx**.

## Contenu
- Diagnostic cépage avec les 98 cépages de la V9.
- Pondérations et courbe de tolérance reprises du simulateur Excel.
- Marqueurs complémentaires : fruit, signature, texture/élevage.
- Top 10 cépages dynamique.
- Diagnostic origine connecté : reprend automatiquement la structure et considère les 10 meilleurs cépages.
- Top 10 origines strictement limité à 10 résultats parmi 204 profils.
- Référentiel cépages consultable.
- Fonctionnement hors ligne via service worker.

## Tester sur un ordinateur
Dans ce dossier, lancer un petit serveur local :

    python3 -m http.server 8080

Puis ouvrir :

    http://localhost:8080

Important : un service worker/PWA ne fonctionne pas correctement en ouvrant simplement `index.html` avec `file://`.

## Installer sur iPhone
1. Héberger le contenu de ce dossier sur un site HTTPS (GitHub Pages, Cloudflare Pages, Netlify, etc.).
2. Ouvrir l'adresse dans Safari sur l'iPhone.
3. Menu Partager → **Ajouter à l'écran d'accueil**.
4. Lancer ensuite **Wine Blind** depuis son icône.

## Portée du prototype
Le moteur reproduit la logique principale de la V9. Il s'agit d'une première version fonctionnelle destinée à tester l'ergonomie mobile avant d'ajouter, par exemple, historique des dégustations, mode arbre décisionnel interactif, profils de révision ou statistiques personnelles.
