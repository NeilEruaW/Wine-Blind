# Wine Blind V11.6.0

## Top 10 origines probabiliste

- Les 203 profils régionaux C2-C2 sont classés par probabilité relative et non plus par simple score d’adéquation.
- Le modèle est hiérarchique : probabilité du cépage, puis probabilité de l’origine conditionnellement au cépage. Le nombre de régions documentées pour un cépage ne crée donc aucun avantage mécanique.
- Les marqueurs régionaux sont pondérés selon leur rareté parmi les profils du même cépage ; les familles, signatures et descripteurs d’une même famille subissent un rendement décroissant.
- La structure exploite les plages régionales et le pouvoir discriminant propre à chaque axe au sein d’un même cépage.
- Les pourcentages sont calibrés selon la quantité de preuves saisies. Une saisie incomplète produit une distribution plus prudente.
- Le Top 10 n’est jamais renormalisé : sa somme peut rester inférieure à 100 %, sans ligne « Autres ».
- Le sélecteur conserve une seule liste alternative : `Monde` calcule la distribution mondiale et `France` la distribution conditionnelle parmi les seuls profils français.
- Les 13 cépages dépourvus de véritable profil régional ne reçoivent aucune origine artificielle.

## Validation

- Campagne Monte-Carlo déterministe de 12 000 cas : 4 000 saisies légèrement, moyennement et fortement dégradées.
- Origine exacte dans le Top 10 : 89,5 % / 73,7 % / 53,9 %.
- Cépage correct représenté dans le Top 10 régional : 93,0 % / 80,9 % / 63,3 %.
- Top 1 franchement incompatible : 0,0 % / 0,0 % / 0,1 %.
- Erreur de calibration ECE : 4,52 / 2,51 / 3,76 points.

Nouveau namespace de cache : `wine-blind-v11-6-0-origin-probability-1`.

---

# Wine Blind V11.5.1

## Couverture probabiliste complète

- Les 98 cépages du Référentiel sont désormais éligibles au Top 10 cépages.
- Les 13 cépages auparavant absents utilisent un profil canonique agrégé issu de leur fiche d’identité, sans créer de faux profil régional dans le Top 10 origines.
- La structure des probabilités cépages provient exclusivement de `WSET_DATA.structureProfile` ; les profils C2-C2 régionaux sont conservés pour le chantier origines.

## Continuité fiche → saisie → score

- Correction de la valeur masculine `Élevé` pour l’alcool.
- Raccordement de l’intensité visuelle à l’axe structurel canonique `Couleur`.
- Projection des rails à trois niveaux sur `1,5 / 3 / 4,5`.
- Tous les descripteurs sélectionnés sont transmis, même sans ancien alias C2-C2.
- Familles, signatures et descripteurs utilisent des clés sémantiques communes dans le modèle probabiliste.

## Validation

- 98/98 fiches quasi exactes classées dans le Top 10 ; 85/98 classées premières.
- Agiorgitiko classé premier à 65,1 % dans le scénario quasi exact automatisé.
- La modulation structurelle v3 est rejetée à 98 cépages ; la baseline canonique, plus robuste, est conservée.

## PWA

Nouveau namespace de cache : `wine-blind-v11-5-1-full-coverage-1`.

---

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
