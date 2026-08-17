# Wine Blind V11.2.1

## Top 10 origines

- Ajout d’un sélecteur alternatif `Monde / France` dans l’unique section Top 10 origines.
- `Monde` reste le périmètre par défaut ; `France` filtre le même classement sur les profils dont la géographie canonique est française.
- Aucun second Top 10 ni aucun moteur concurrent n’est créé.
- Les allers-retours de périmètre réutilisent le score déjà calculé et ne relancent pas C2-C2.

## PWA

Nouveau namespace de cache : `wine-blind-v11-2-1-origin-scope-1`.

---

# Wine Blind V11.2.0

## Source aromatique canonique

- Une seule source générée alimente désormais les empreintes ouvertes depuis le Top 10 et le Référentiel.
- Les 18 enrichissements issus de la revue scientifique des fiches Jean Lenoir sont promus avec phase, famille, descripteur et prévalence 1/2/3.
- Les empreintes présentent les familles et les descripteurs en français selon les trois phases primaire, secondaire et tertiaire.

## Scoring contrôlé

- Les 18 relations approuvées sont intégrées à C2-C2 par un overlay traçable, sans réécriture de `c2c2-data.js`.
- Leur contribution est uniquement positive et pondérée par la prévalence : une correspondance peut améliorer l’adéquation, mais l’absence du descripteur n’est jamais pénalisante.
- Les 101 mentions jugées contextuelles lors de la revue restent exclues du scoring.

## PWA

Nouveau namespace de cache : `wine-blind-v11-2-0-aroma-1`.

---

# Wine Blind V11.1.0

## Lecture du diagnostic

- Le rang reste calculé par l'indice C2-C2 gelé `I = 3.20 × A + S_eff + C`.
- Le nombre présenté dans les cartes est désormais l'adéquation aux seuls repères réellement saisis. Une structure parfaitement compatible n'est donc plus divisée par le maximum aromatique lorsque l'utilisateur n'a renseigné aucun arôme.
- Les sous-scores Structure et Arômes rendent la contribution de chaque volet explicite.

## Fiches cépages

- Les notes précises et plages historiques du Référentiel restent l'unique source des fiches ouvertes depuis le Référentiel comme depuis le Top 10.
- L'empreinte affiche maintenant les familles et leurs descripteurs en français, sous les trois lectures Primaires / Secondaires / Tertiaires.
- Les trois prévalences 1 / 2 / 3 sont affichées, y compris les marqueurs contextuels de niveau 1.

## Moteur

Aucun profil, coefficient, marqueur, intervalle, rang ni règle C2-C2 n'est modifié dans cette version.

---

# Wine Blind V11.0.3 RESET

## Base restaurée

Frontend et présentation restaurés depuis le commit V10.7.2 (`00044d294887797ac906952c385563f814d934bf`), dernier état complet avant la reconstruction V11.

## Moteur

Diagnostic principal : candidate C2-C2 gelée (`Wine-Blind-vNext-C2-C2`). Aucun recalibrage n'est effectué dans cette release.

## Ajustements UX validés

- Top 10 Origines : cartes cliquables ouvrant la fiche du profil origine/style.
- Fiches C2-C2 : centres structurels à 0,1 et plages `[L–U]` à 0,1.
- Cartes structurelles : libellé → niveau SAT → valeur précise → plage.
- Suppression du reliquat `4` devant Top 10 Origines.
- Suppression de l'étape `Affiner le style` avant les origines.
- Mise en avant du premier résultat et explication `Pourquoi ?`.
- Comparaison des deux premières hypothèses lorsque pertinent.
- Indicateur de confiance aligné sur les résultats C2-C2.
- Historique : diagnostic sauvegardé depuis C2-C2 et non l'ancien moteur.

## PWA

Nouveau namespace de cache : `wine-blind-v11-reset-c2c2-1`. Les anciens caches sont supprimés à l'activation.
