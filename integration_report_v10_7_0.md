# Wine Blind V10.7.0 — intégration de l'audit de fond

## Portée
- 98 cépages enrichis.
- 203 profils régionaux enrichis.
- 1 000 lignes d'empreinte aromatique pondérée intégrées.
- 9 relations de profils multiples conservées et qualifiées en variantes de style quand elles sont légitimes.

## Nouveau modèle structurel
Chaque critère structurel dispose désormais de :
- `typical` : valeur centrale d'identification ;
- `min` / `max` : plage typique cohérente ;
- `confidence` : confiance documentaire interne.

Le score est maximal autour de la valeur typique, reste élevé dans la plage et diminue progressivement hors plage. Une confiance documentaire limitée n'abaisse jamais un bon match : elle adoucit seulement la force d'une incompatibilité.

## Empreinte aromatique
Chaque cépage possède `aromaFingerprint` :
- `primary` : empreinte variétale / fermentation alcoolique ;
- `secondary` : compatibilités de vinification ;
- `tertiary` : compatibilités d'évolution / vieillissement.

Chaque groupe porte un poids 1–3 et les indices textuels issus de l'audit. L'absence d'un marqueur attendu n'est pas pénalisée ; la présence d'un marqueur caractéristique apporte de l'information positive.

## Fiches cépages
Les fiches affichent désormais :
- valeur typique + plage pour acidité, tanins, alcool, corps, intensité visuelle et aromatique ;
- une nouvelle rubrique « Empreinte aromatique » avec les groupes pondérés.

## Profils régionaux
Les 203 profils ont désormais leur propre `structureProfile`, plus resserré que le profil variétal générique.
Les profils multiples d'un même cépage dans une même unité géographique sont conservés sous forme de variantes de style (`styleVariant` / `profileFamily`).

## Contrôle de cohérence interne
Simulation synthétique sur 15,000 dégustations cépages :
- Top 1 : 74.4 %
- Top 3 : 94.6 %
- Top 5 : 98.4 %
- Top 10 : 100.0 %

Simulation régionale à cépage connu sur 8,368 cas :
- Top 1 : 65.9 %
- Top 3 : 91.6 %
- Top 5 : 97.4 %

Ces simulations testent la cohérence interne du modèle sur des observations générées à partir de ses propres plages. Elles ne constituent pas une mesure de précision sur de vraies dégustations.

## À revoir ultérieurement
- Les alertes documentaires issues de l'audit restent stockées en base (`auditFlags`) et ne sont pas supprimées.
- Les 13 cépages insuffisamment couverts par les documents WSET restent identifiés par une confiance documentaire limitée.
- Les teintes exactes et la douceur ne reçoivent toujours pas de fort poids variétal ; elles seront plus pertinentes au niveau des styles/origines lors du rapprochement des diagnostics.
