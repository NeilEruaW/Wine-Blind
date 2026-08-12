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

## V9.7 — moteur Origine normalisé V10.7
- Top 10 Origine limité aux régions normalisées de V10.7 : aucun mélange région/appellation.
- Plusieurs profils sensoriels d’une même région sont consolidés ; seul le meilleur profil représente la région.
- Sous-régions/appellations filtrées exclusivement par Parent_ID de la région sélectionnée.
- Libellés principaux raccourcis : la carte affiche la région, puis le cépage et le pays séparément.
- Détail Origine structuré Pays → Région → Sous-régions / Appellations.

## V9.8 / V10.8 — unités diagnostiques
- Le Top 10 Origine classe désormais des unités diagnostiques œnologiquement homogènes, pas des régions administratives de granularité inégale.
- Grandes régions subdivisées (Loire, Bordeaux, Bourgogne, Rhône, Piemonte, Veneto, Duero, Galice, etc.).
- Régions déjà discriminantes conservées (Mosel, Santorini, Coonawarra, Central Otago...).
- Aucun cumul des profils : le meilleur profil d'une unité représente seul cette unité.
- Pondération décroissante des candidats cépages : 100 / 75 / 55 / 35 / 20 % pour les cinq premiers.
- Bonus modéré de spécificité géographique du cépage (max. environ +10 % sur la composante cépage).

## V9.9 — Référentiel alphabétique
- Cépages triés systématiquement de A à Z, y compris après filtre ou recherche.
- Séparateurs alphabétiques discrets dans la liste.
- Index vertical A–Z à droite, type répertoire téléphonique.
- Glissement continu sur l'index avec effet loupe « Dock » sur la lettre active et ses voisines.
- Lettres absentes du résultat courant automatiquement atténuées.

## V10.0 — Référentiel géographique
- Le Référentiel comporte désormais deux entrées : Cépages et Origines.
- Origines : navigation Pays → région mère → unité diagnostique → appellations/zones.
- Fiches Origine pédagogiques : cépages clés, profils à l'aveugle, appellations/zones, différenciation et confusions.
- Recherche universelle : une recherche d'appellation (ex. Cornas) remonte l'unité diagnostique parente.
- Navigation croisée depuis les fiches Cépages vers leurs unités diagnostiques.
- Filtre horizontal par pays dans le mode Origines.

## V10.1 — Diagnostic guidé adaptatif
- Ancien arbre binaire remplacé par une banque de 40+ questions discriminantes.
- Séquence adaptative : la prochaine question maximise la séparation des candidats encore plausibles.
- Réponses Oui / Non / Incertain ; aucun texte de correction ne s'affiche après une réponse.
- Historique complet des questions/réponses, chaque étape pouvant être modifiée.
- Nombre de questions variable, typiquement 6–15, plafond à 18.
- Jauge de convergence plutôt qu'un nombre fixe d'étapes.
- Sortie sur 3–5 cépages probables avec critères discriminants pour les départager.
- Bouton « Continuer à départager » et transfert vers le Diagnostic Cépage complet.

## V10.2 — synchronisation arbre / Diagnostic Cépage
- L'historique des questions/réponses est désormais affiché sous la question active.
- Chaque réponse exploitable pré-renseigne immédiatement le Diagnostic Cépage et déclenche son recalcul.
- Une modification ou suppression d'une ancienne réponse recalcule aussi le pré-renseignement.
- Les candidats finaux de l'arbre utilisent exactement `geval()`, donc le même scoring et le même classement que le Top 10 Cépages.
- Les réponses aromatiques discriminantes alimentent également Famille de fruit, Marqueur signature ou Texture/élevage lorsqu'une correspondance existe.

## V10.3 — Référentiel visuel
- Cépages légèrement teintés selon leur couleur : bordeaux pour rouges, doré pour blancs.
- Origines : rouge, blanc ou bicolore lorsque les profils de l’unité couvrent les deux couleurs.
- Index A–Z désormais ancré au début réel de la liste, puis sticky pendant le défilement.
- Ajout d’une flèche ↑ en tête d’index pour revenir immédiatement au début de la liste.
- Le glissement sur l’index fonctionne dans les deux sens avec saut direct, sans animation qui bloque les remontées.
- Les Origines sont triées alphabétiquement par libellé ; le pays reste visible et filtrable.
- Petit compteur de résultats et légende couleur intégrés au-dessus de la liste.

## V10.3-clickfix — correction minimale de l'index
- Base strictement reprise de la V10.3, où l'index A–Z était visible et correctement positionné.
- Aucun changement CSS ni de positionnement de l'index.
- Un toucher simple n'active plus la logique de glissement au `pointerdown`.
- Le clic natif déclenche un seul saut direct vers la lettre choisie, que celle-ci soit au-dessus ou au-dessous de la position actuelle.
- Le mode glissement ne s'active qu'après un déplacement vertical volontaire d'au moins 7 px.

## V10.4 — S'entraîner
- « Cas pratique » devient « Quiz & Défis » au sein de l'onglet Entraînement.
- Trois difficultés : Fondamentaux, Avancé, Expert.
- Six sessions : Session rapide, Aveugle, Origines & appellations, Duels, Intrus, Mes points faibles.
- Génération dynamique depuis les référentiels Cépages et V10.8 Origines/Appellations.
- Les questions d'identification de cépage ne donnent plus les régions typiques avant la réponse.
- QCM multi-formats : cépage, origine, appellation→cépage, appellation→origine, duel structurel, intrus géographique, marqueur aromatique.
- Feedback pédagogique après chaque réponse avec « À retenir ».
- Sessions de 10 questions, score et progression.
- Statistiques locales simples et mémorisation des erreurs pour le mode « Mes points faibles ».
- La future banque théorique WSET peut être ajoutée en V10.5 sans modifier l'architecture.

## V10.5 — Banque théorique WSET
- Nouveau mode « Théorie WSET » dans Quiz & Défis.
- Sélecteur L1 / L2 / L3 / L4.
- 152 questions originales intégrées, dont des questions conceptuelles rédigées spécifiquement et des variantes générées depuis les référentiels Wine Blind.
- Les niveaux L1–L3 reprennent la logique de difficulté et les domaines des specifications WSET sans reproduire les questions officielles ou commerciales.
- Le niveau L4 est explicitement « Diploma-inspired » : le Diploma est évalué par réponses ouvertes, donc ces QCM servent à entraîner le raisonnement et non à simuler le format exact de l'examen.
- Catégories : cépages, service/accords, viticulture, vinification, élevage, régions, effervescents, fortifiés, D1 Production, D2 Business, D3 Monde, D4 et D5.

## V10.5.1 — banque théorique fortement enrichie
- Banque portée à 716 QCM uniques.
- Contrôle automatique : 0 doublon exact de question et 0 jeu de réponses invalide.
- Distracteurs renforcés : même pays pour les hiérarchies géographiques, même cépage pour les profils régionaux, cépages structurellement proches pour la dégustation.
- Couverture élargie : viticulture, vinification, service, styles, cépages, régions, appellations, géographie, profils régionaux, effervescents, fortifiés et unités Diploma.
- Brainscape, Wine With Jimmy et autres ressources publiques servent de benchmark de couverture et de difficulté ; leurs flashcards/questions propriétaires ne sont pas copiées textuellement.
- Le fichier `question_bank_audit.json` documente la couverture et les contrôles automatiques.

## V10.5.2 — théorie renforcée et entraînement ciblé
- Banque portée à 772 questions uniques.
- Renforcement qualitatif de viticulture, vinification, élevage, stabilisation, défauts, service/accords, effervescents, fortifiés et raisonnement régional.
- Nouveau filtre de thème pour la théorie.
- Nouveau mode Examen blanc : 30 QCM au L1, 50 QCM aux L2/L3.
- Brainscape, Quizlet, GrapeQuiz, ThirtyFifty et Wine With Jimmy servent de benchmarks de couverture et de style ; aucune banque propriétaire n'est reproduite textuellement.

## V10.5.3 — approfondissement qualitatif
- Banque portée à 931 QCM uniques.
- Ajout d'un bloc de questions L3 causales : facteur → conséquence sur le raisin → décision de production → style/qualité/prix.
- Renforcement de viticulture, vinification, économie de production, effervescents et fortifiés.
- 100 exercices « Application multi-étapes » reliant profil sensoriel, cépage, contexte régional et critère de vérification.
- Nouveau filtre « Raisonnement & application ».
- SommBench vérifié : 1 024 WTQA + 1 000 WFC + 1 000 FWP, huit langues ; dépôt sous Apache-2.0. Cette version l'utilise comme benchmark de couverture sans importer textuellement ses questions.

## V10.5.4 — audit croisé et enrichissement ciblé
- Audit croisé de la banque V10.5.3 avec l'architecture WSET Level 3, les documents WSET D1/D2/D4/D5, Fine Vintage et SommBench.
- Banque finale : 989 questions uniques, dont 804 au niveau L3.
- Aucun quota d'examen non documenté n'a été inventé : la matrice mesure une couverture pédagogique par grands domaines.
- Lacunes V10.5.3 identifiées : dégustation/service/accords, viticulture, vinification/élevage, qualité-prix-droit, effervescents et fortifiés.
- 58 questions L3 originales ajoutées uniquement dans ces domaines ; aucune augmentation des catégories géographiques déjà très fortement couvertes.
- Examen blanc désormais stratifié par grands thèmes lorsque « Tous les thèmes » est sélectionné, afin d'éviter qu'une session soit dominée par la géographie.
- Fichiers d'audit : coverage_audit_v10_5_4.csv et coverage_audit_v10_5_4.json.

## V10.5.5 — refonte UX
- Arbre guidé et Quiz & Défis deviennent deux onglets autonomes de la Tab Bar.
- Historique retiré de la Tab Bar et accessible depuis les deux diagnostics.
- Quiz simplifié : choix de l’objectif avant les paramètres.
- Session rapide sans configuration ; difficulté uniquement pour les modes qui la nécessitent.
- Niveau L1-L4 et Examen blanc uniquement dans Théorie WSET.
- Thèmes & défis regroupe Duels, Intrus et Points faibles.
- Suppression des mentions techniques de banque auditée et de la note L4 sur l’écran principal.

## V10.5.7 — ajustements Quiz & Défis
- Théorie WSET remontée en première position.
- Sous-texte Origines & appellations simplifié en « Géographie ».
- Duels et Quel est l’intrus ? deviennent deux entrées directes distinctes.
- Mes points faibles déplacé en dernière position et lancé directement, sans sélecteur de difficulté.
- Le niveau affiché sur chaque question reste celui de la question effectivement tirée.
- Sélecteur Fondamentaux / Avancé / Expert corrigé : seules les valeurs actives sont en noir et renforcées visuellement.

## V10.5.9 — filtre pays dans Référentiel > Cépages
- Le filtre horizontal par pays est désormais disponible dans les deux modes du Référentiel : Cépages et Origines.
- Pour les cépages, le pays est déduit des clés de la rubrique « Régions de production » (`productionWorld`).
- Le filtre pays se combine avec Rouge / Blanc / À réviser et avec la recherche universelle.
- Le filtre revient sur « Tous » lorsqu'on bascule entre Cépages et Origines, afin d'éviter un filtre invisible ou non pertinent.

## V10.6.0 — Diagnostic Cépage aligné sur le SAT WSET L3
Évolution structurante du diagnostic.

### Œil
- Séparation de l'intensité visuelle et de la couleur.
- Intensité : Pâle / Moyenne / Intense.
- Blanc : Jaune-vert / Jaune citron / Or / Ambré / Brun.
- Rouge : Violacé / Rubis / Grenat / Tuilé / Brun.

### Nez et bouche
- Les valeurs sont affichées en toutes lettres en haut à droite des continuums.
- Acidité et tanins : échelle 5 niveaux.
- Alcool : échelle SAT 3 niveaux.
- Ajout de la douceur : Sec / Pas tout à fait sec / Demi-sec / Moelleux / Doux / Très doux.
- Ajout de l'intensité des saveurs.
- Intensité aromatique et intensité des saveurs sont rapprochées de la même référence d'intensité du cépage sans double pondération.

### Arômes & saveurs
- Remplacement de « Marqueurs complémentaires » par le Wine-Lexicon à trois niveaux : primaires, secondaires, tertiaires.
- Sélection multiple des familles.
- Toucher une famille révèle ses descripteurs détaillés sans menu déroulant.
- Les descripteurs sont facultatifs.
- Un poids aromatique modéré est introduit dans le Top 10 : famille sélectionnée d'abord, descripteurs en bonus.
- « Marqueur signature » devient « + Indice discriminant », optionnel et replié par défaut.

### Compatibilité moteur
- Le champ historique `color` conserve en interne le sens d'intensité/profondeur visuelle afin de rester compatible avec la base cépages actuelle.
- La teinte exacte (`colorShade`) et la douceur sont enregistrées mais ne reçoivent pas encore de poids propre, la V10.5.9 ne contenant pas de référence cépage suffisamment structurée pour les scorer sans inventer de données.
- L'Arbre guidé conserve la compatibilité avec ses pré-renseignements existants ; les anciennes valeurs intermédiaires d'alcool/intensité visuelle sont rabattues sur l'échelle SAT 3 niveaux.

## V10.6.1 — ajustements UX du diagnostic SAT
- Recentrage visuel des continuums à trois positions (intensité visuelle et alcool).
- Suppression de l'affichage « Non renseigné » lorsque les continuums/rails sont vides ; l'état reste conservé pour l'accessibilité.
- Les blocs aromatiques sont renommés simplement « Primaires », « Secondaires » et « Tertiaires ».
- Les familles aromatiques sont désormais toujours visibles : plus besoin de déplier une catégorie préalable.
- Un bouton ⓘ affiche à la demande la définition pédagogique de chaque niveau aromatique.
- L'indice discriminant affiche uniquement « Optionnel » lorsqu'il n'est pas renseigné.

## V10.6.2 — finitions visuelles du diagnostic
- « Dégustation SAT » devient simplement « Dégustation ».
- Les points des échelles à trois positions (intensité visuelle et alcool) sont encore décalés vers la droite pour mieux s'aligner sur leur barre.
- L'échelle « Couleur » devient chromatique : chaque point est affiché avec une teinte correspondant au vin décrit.
- Palette blancs : jaune-vert, jaune citron, or, ambré, brun.
- Palette rouges : violacé, rubis, grenat, tuilé, brun.
- La valeur active conserve sa teinte propre et est simplement accentuée par la taille et le halo.

## V10.7.0 — base auditée, plages typiques et empreintes aromatiques
- Intégration de l'audit de fond des 98 cépages et 203 profils régionaux.
- Passage des valeurs centrales simples à `typical + min/max + confidence`.
- Nouveau scoring structurel progressif par plage typique.
- Confiance documentaire utilisée uniquement pour adoucir les incompatibilités incertaines, jamais pour diminuer un bon match.
- Intégration des empreintes aromatiques primaires / secondaires / tertiaires pondérées.
- Les fiches cépages affichent les plages et l'empreinte aromatique.
- Les profils régionaux multiples sont conservés comme variantes de style explicites.
- Ajout d'un rapport d'intégration et de simulations de cohérence interne.

## V10.7.1 — présentation des plages dans les fiches cépages
- La valeur typique redevient l'information visuellement dominante.
- La plage typique est affichée juste en dessous, en caractères plus petits et entre crochets : `[min–max]`.
- Lorsqu'une plage se réduit à une valeur unique, elle n'est pas répétée.
- Aucun changement du moteur de scoring ni de la base auditée V10.7.0.
