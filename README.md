# Wine Blind V11.0.0 — C2-C2

Paquet PWA autonome basé sur la candidate gelée `Wine-Blind-vNext-C2-C2`.

## Déploiement
Servir ce dossier en HTTPS sur un hébergement statique (GitHub Pages, Netlify, Vercel, Cloudflare Pages ou équivalent). Le service worker nécessite HTTPS (sauf localhost).

## Démarrage local
`python -m http.server 8080` puis ouvrir `http://localhost:8080`.

## Modèle
SHA-256 du modèle : `1be790371292ff6675b83b76f4b28bb58f965ba919e4bf263b1d8523bb225c5f`

## Fonctionnalités
- saisie SAT tactile ;
- familles, signatures et descripteurs exacts ;
- Top 10 cépages avec meilleur profil géographique/style ;
- structure C2-C2 centre + plage ;
- moteur intégré A + S_eff + C ;
- recherche/fiches des 85 cépages / 203 profils ;
- historique local ;
- mode entraînement ;
- installation PWA / hors-ligne.

## Known issue
KI-ZINF-JAMMY-001 conservé pour une future version : `jammy/confituré` n'est pas ajouté rétroactivement comme exact variétal Zinfandel dans cette release.
