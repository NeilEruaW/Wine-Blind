# Calibration du Top 10 origines — V11.6.0

## Périmètre

Le moteur couvre 203 profils régionaux documentés associés à 85 cépages. Les périmètres `Monde` et `France` utilisent le même moteur et une seule liste, mais chacun calcule sa propre distribution de probabilités sur son univers éligible.

La probabilité d’un profil régional est construite en deux étages :

`P(profil régional | saisie) = P(cépage | saisie) × P(profil régional | cépage, saisie)`

Cette architecture neutralise l’effet de volume qui avantagerait sinon les cépages disposant du plus grand nombre de profils régionaux.

## Campagne déterministe

La campagne utilise 12 000 simulations avec une graine fixe, réparties à parts égales entre trois niveaux de dégradation. Les profils cibles sont tirés dans les univers Rouge/Blanc et Monde/France. Les erreurs portent sur le bruit structurel, la suppression de repères et l’ajout de marqueurs erronés.

| Dégradation | Profil exact Top 1 | Profil exact Top 3 | Profil exact Top 10 | Cépage correct Top 10 | Top 1 incompatible | ECE |
|---|---:|---:|---:|---:|---:|---:|
| Légère | 47,0 % | 71,1 % | 89,5 % | 93,0 % | 0,0 % | 4,52 pts |
| Moyenne | 26,6 % | 49,2 % | 73,7 % | 80,9 % | 0,0 % | 2,51 pts |
| Forte | 12,4 % | 27,7 % | 53,9 % | 63,3 % | 0,1 % | 3,76 pts |

Le recul du profil exact lorsque les informations sont fortement dégradées est attendu : plusieurs régions d’un même cépage deviennent sensoriellement indiscernables. Le garde-fou principal est respecté, puisque les profils franchement incompatibles ne remontent pratiquement jamais au premier rang.

## Interprétation des pourcentages

Le Top 10 affiche la masse probabiliste réelle de chaque candidat dans le périmètre actif. Les dix valeurs ne sont pas renormalisées et peuvent donc totaliser moins de 100 %. La calibration dépend du volume d’indices afin de ne pas afficher une fausse précision sur une saisie lacunaire.

Cette validation mesure la cohérence interne du modèle sur des cas synthétiques issus des fiches d’identité. Elle ne remplace pas une validation externe sur un corpus indépendant de dégustations réelles.
