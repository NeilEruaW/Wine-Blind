# QA — Wine Blind V11.2.0

## Promotion aromatique

- 199 associations expertisées : 80 confirmations, 18 enrichissements promus et 101 mentions maintenues comme contextuelles.
- 2 935 relations canoniques sur 98 cépages ; 509 relations éligibles au scoring sur 85 cépages et 203 profils C2-C2.
- Test différentiel des 18 enrichissements : chacun produit une contribution positive pour le cépage cible.
- Test d’absence : sans sélection des nouveaux descripteurs, les scores et classements restent strictement inchangés.
- `data.js` et `c2c2-data.js` restent inchangés ; les ajouts passent par les overlays canoniques générés.
- Parité vérifiée entre les fiches ouvertes depuis le Top 10 et le Référentiel.

## Contrôles automatisés

- `analysis/canonical-aroma/test.mjs` : **PASS**.
- `tests/canonical-aroma-scoring.mjs` : **PASS (18/18)**.
- `tests/smoke.mjs` : **PASS**.
- La batterie WebKit mobile n’a pas été rejouée dans ce conteneur, où Playwright n’est pas installé ; ses scénarios ont été mis à jour pour V11.2.0.

---

# QA — Wine Blind V11.1.0

## Contrôles spécifiques

- Cas étalon Pinot noir : une saisie des cinq axes au centre du profil classe le Pinot noir premier, avec 100 % d'adéquation structurelle.
- Vérification que la normalisation d'affichage dépend de la masse d'information saisie, tandis que le tri demeure fondé sur l'indice brut C2-C2.
- Vérification statique des 85 cépages et 203 profils, des correspondances françaises et de la fin du masquage des empreintes de niveau 1.
- Parcours WebKit mobile : navigation Rouge/Blanc, rafales de sélections, ouverture de la même fiche depuis le Top 10 et le Référentiel, présence des descripteurs et des niveaux 1/2/3.

---

# QA — Wine Blind V11.0.3 RESET

## Contrôle de restauration

Comparaison avec le commit V10.7.2 (`00044d294887797ac906952c385563f814d934bf`) :

- `app.js` : **identique** au frontend historique V10.7.2.
- `styles.css` : **identique** à V10.7.2.
- `data.js`, `v106.js`, `v107.js`, `v108.js`, `tree.js` : **identiques** à V10.7.2.
- Les seuls changements runtime sont l'ajout C2-C2, l'overlay UX, l'index de chargement, le manifest et le service worker.

## Contrôle C2-C2

- `c2c2-data.js` reprend exactement le blob C2-C2 déjà déployé sur la branche V11 précédente : SHA Git `efd94837cc597f1ec4fdc391b18312437a94233f`.
- Le scoring reste `I = 3.20 × A + S_eff + C`.
- Aucun centre, plage, marqueur, typicalité, poids ou règle de cohérence n'est modifié par `v11-reset-patch.js`.

## Non-régressions fonctionnelles visées

- navigation historique 5 onglets conservée ;
- continuum SAT tactile conservé ;
- arbre guidé conservé ;
- Quiz & Défis conservés ;
- historique conservé et diagnostic sauvegardé depuis C2-C2 ;
- référentiel cépages/origines conservé ;
- Top 10 cépages et origines alimentés par C2-C2 ;
- fiches origine/style cliquables ;
- fiches structurelles à 0,1 avec plages à 0,1 ;
- `Affiner le style` et le badge `4` supprimés ;
- service worker isolé dans un nouveau namespace de cache.

## Point restant avant bascule de `main`

Effectuer un smoke-test visuel réel dans Safari/iPhone : saisie SAT, Top 10, ouverture d'une fiche cépage, ouverture d'une origine, Quiz, Référentiel, Historique et réinstallation PWA. La branche `main` n'est pas modifiée tant que ce contrôle n'est pas validé.
