# Comparaison appariée — pondération structurelle discriminante v3

**12000 simulations**, graine 0x57424d43, mêmes cas pour la baseline et la variante. Verdict global : **PASS**.

| Segment | Niveau | Cépage réel Top 10 | Top 1 réel/proche | Top 1 incompatible | Masse incompatible | Erreurs >50 % | Gate |
|---|---|---:|---:|---:|---:|---:|---|
| Rouge | light | 97.7 % → 97.7 % (+0.0 pt) | 63.2 % → 64.1 % | 1.1 % → 1.1 % | 2.2 % → 2.3 % | 21.6 % → 20.8 % | PASS |
| Rouge | medium | 81.5 % → 82.2 % (+0.6 pt) | 50.6 % → 50.9 % | 2.1 % → 2.2 % | 4.2 % → 4.2 % | 27.0 % → 25.8 % | PASS |
| Rouge | heavy | 61.8 % → 62.4 % (+0.6 pt) | 35.6 % → 35.5 % | 5.5 % → 5.5 % | 8.6 % → 8.6 % | 25.1 % → 24.3 % | PASS |
| Blanc | light | 97.5 % → 97.7 % (+0.1 pt) | 56.3 % → 56.2 % | 0.2 % → 0.3 % | 0.8 % → 0.8 % | 13.2 % → 12.6 % | PASS |
| Blanc | medium | 79.7 % → 80.5 % (+0.9 pt) | 42.6 % → 43.0 % | 1.1 % → 1.1 % | 2.0 % → 2.0 % | 17.4 % → 16.7 % | PASS |
| Blanc | heavy | 60.6 % → 61.0 % (+0.4 pt) | 29.9 % → 30.0 % | 3.8 % → 3.9 % | 5.7 % → 5.7 % | 15.3 % → 14.9 % | PASS |

## Cépages les moins documentés

Le tableau signale un besoin d’enrichissement ; il ne déclenche aucune réduction des profils riches.

| Cépage | Type | Profils | Marqueurs | Familles | Signatures | Descripteurs |
|---|---|---:|---:|---:|---:|---:|
| Altesse | Blanc | 1 | 10 | 4 | 3 | 3 |
| Fer Servadou | Rouge | 1 | 10 | 4 | 3 | 3 |
| Sciaccarello | Rouge | 1 | 11 | 6 | 2 | 3 |
| Tibouren | Rouge | 1 | 12 | 6 | 3 | 3 |
| Piquepoul Blanc | Blanc | 1 | 13 | 4 | 1 | 8 |
| Aligoté | Blanc | 1 | 14 | 8 | 1 | 5 |
| Bobal | Rouge | 1 | 14 | 5 | 2 | 7 |
| Jacquère | Blanc | 1 | 14 | 4 | 1 | 9 |
| Poulsard | Rouge | 1 | 15 | 4 | 1 | 10 |
| Duras | Rouge | 1 | 16 | 5 | 2 | 9 |
| Godello | Blanc | 1 | 16 | 8 | 2 | 6 |
| Moschofilero | Blanc | 1 | 16 | 5 | 2 | 9 |
| Bonarda Argentina | Rouge | 1 | 17 | 8 | 3 | 6 |
| Melon de Bourgogne | Blanc | 1 | 17 | 7 | 1 | 9 |
| Saperavi | Rouge | 1 | 17 | 5 | 2 | 10 |
| Agiorgitiko | Rouge | 1 | 18 | 10 | 2 | 6 |
| Négrette | Rouge | 1 | 18 | 6 | 2 | 10 |
| Romorantin | Blanc | 1 | 18 | 5 | 2 | 11 |
| Petit Manseng | Blanc | 1 | 19 | 10 | 2 | 7 |
| Savagnin | Blanc | 2 | 19 | 6 | 3 | 10 |

## Règle de décision

La variante doit ne régresser dans aucun segment sur le Top 10 réel, le Top 1 réel/proche, le Top 1 incompatible, la masse incompatible et les erreurs faussement confiantes. Une tolérance maximale de 0,2 point est admise par métrique segmentaire lorsque le bilan global est amélioré ; au-delà, une amélioration moyenne ne compense pas un échec segmentaire.
