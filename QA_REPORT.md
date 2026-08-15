# Wine Blind V11.0.0 — contrôle de non-régression fonctionnelle

Statut : **PASS pour la matérialisation logicielle / PWA**.

## Intégrité modèle
- Candidate embarquée : `Wine-Blind-vNext-C2-C2`.
- SHA-256 modèle : `1be790371292ff6675b83b76f4b28bb58f965ba919e4bf263b1d8523bb225c5f`.
- 203 profils, 85 cépages, 77 marqueurs canoniques, 63 exacts.
- Hiérarchie M2 vérifiée : exact 1,50 > signature 1,25 > famille 1,00.
- Structure directe SAT : centre inclus dans plage => similarité 1 ; 5 axes renseignés => κ=1.
- Cohérence bornée : C reste dans [-0,08 ; +0,04].

## Exécution moteur
- JavaScript `engine.js` : syntaxe PASS.
- JavaScript `app.js` : syntaxe PASS.
- Classement retourne 85 cépages et aucun score non-fini.
- Scan synthétique des 203 profils (centres structurels + 5 marqueurs les plus forts) :
  - Top1 : 190 / 203
  - Top5 : 203 / 203
  - Top10 : 203 / 203
Ce scan vérifie la cohérence d'exécution du moteur ; ce n'est pas un nouveau benchmark externe.

## Fonctions PWA vérifiées statiquement
- `index.html`, `styles.css`, `app.js`, `engine.js` présents.
- `manifest.webmanifest` valide et icônes 192/512 présentes.
- Service worker référence tous les actifs nécessaires au mode hors-ligne.
- SHA du modèle embarqué concorde avec `release.json`.
- Fonctions présentes dans l'interface : Diagnostic SAT, Top 10 + profil origine/style, entraînement, référentiel/recherche, historique local.

## Limite du contrôle
Le dernier paquet source PWA antérieur n'était pas disponible dans les fichiers du projet au moment de cette matérialisation. Le contrôle porte donc sur la **spécification fonctionnelle connue** et l'intégrité C2-C2, et non sur un diff ligne-à-ligne contre l'ancienne application.

## Known issue conservé
`KI-ZINF-JAMMY-001` : jammy/confituré reste consigné pour une future version et n'est pas ajouté rétroactivement à C2-C2.
