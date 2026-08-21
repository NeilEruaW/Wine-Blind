# Comparaison appariée — pondération structurelle discriminante v3

**12000 simulations**, graine 0x57424d43, mêmes cas pour la baseline et la variante. Verdict global : **FAIL — variante rejetée en l’état**.

Décision applicative : **baseline canonique conservée**.

| Segment | Niveau | Cépage réel Top 10 | Top 1 réel/proche | Top 1 incompatible | Masse incompatible | Erreurs >50 % | Gate |
|---|---|---:|---:|---:|---:|---:|---|
| Rouge | light | 100.0 % → 100.0 % (+0.0 pt) | 92.1 % → 91.8 % | 0.0 % → 0.0 % | 0.4 % → 0.4 % | 3.2 % → 3.1 % | PASS |
| Rouge | medium | 97.0 % → 97.0 % (+0.0 pt) | 72.8 % → 72.9 % | 0.9 % → 0.9 % | 2.1 % → 2.1 % | 6.8 % → 6.5 % | PASS |
| Rouge | heavy | 79.8 % → 79.8 % (-0.1 pt) | 45.2 % → 45.4 % | 3.6 % → 3.5 % | 6.9 % → 6.9 % | 9.2 % → 8.8 % | PASS |
| Blanc | light | 99.4 % → 99.4 % (+0.0 pt) | 79.7 % → 79.3 % | 0.4 % → 0.4 % | 1.4 % → 1.4 % | 3.6 % → 3.5 % | FAIL |
| Blanc | medium | 93.5 % → 93.5 % (+0.1 pt) | 60.4 % → 60.1 % | 2.9 % → 2.9 % | 3.9 % → 4.0 % | 4.2 % → 4.0 % | FAIL |
| Blanc | heavy | 77.8 % → 78.1 % (+0.3 pt) | 38.5 % → 38.5 % | 7.2 % → 7.2 % | 8.7 % → 8.7 % | 5.1 % → 5.0 % | PASS |

## Cépages les moins documentés

Le tableau signale un besoin d’enrichissement ; il ne déclenche aucune réduction des profils riches.

| Cépage | Type | Profils | Marqueurs | Familles | Signatures | Descripteurs |
|---|---|---:|---:|---:|---:|---:|
| Auxerrois | Blanc | 1 | 5 | 3 | 0 | 2 |
| Bourboulenc | Blanc | 1 | 5 | 3 | 0 | 2 |
| Mondeuse Noire | Rouge | 1 | 5 | 3 | 0 | 2 |
| Folle Blanche | Blanc | 1 | 6 | 4 | 0 | 2 |
| Pineau d'Aunis | Rouge | 1 | 7 | 4 | 0 | 3 |
| Fer Servadou | Rouge | 1 | 8 | 2 | 3 | 3 |
| Mauzac | Blanc | 1 | 8 | 5 | 0 | 3 |
| Altesse | Blanc | 1 | 9 | 3 | 3 | 3 |
| Sciaccarello | Rouge | 1 | 9 | 4 | 2 | 3 |
| Tibouren | Rouge | 1 | 9 | 3 | 3 | 3 |
| Arneis | Blanc | 1 | 10 | 5 | 0 | 5 |
| Bobal | Rouge | 1 | 10 | 5 | 0 | 5 |
| Piquepoul Blanc | Blanc | 1 | 11 | 4 | 1 | 6 |
| Aligoté | Blanc | 1 | 13 | 8 | 0 | 5 |
| Jacquère | Blanc | 1 | 13 | 4 | 1 | 8 |
| Falanghina | Blanc | 1 | 14 | 7 | 1 | 6 |
| Godello | Blanc | 1 | 14 | 8 | 0 | 6 |
| Bonarda Argentina | Rouge | 1 | 15 | 7 | 2 | 6 |
| Colombard | Blanc | 1 | 15 | 10 | 0 | 5 |
| Duras | Rouge | 1 | 15 | 4 | 2 | 9 |

## Règle de décision

La variante doit ne régresser dans aucun segment sur le Top 10 réel, le Top 1 réel/proche, le Top 1 incompatible, la masse incompatible et les erreurs faussement confiantes. Une tolérance maximale de 0,2 point est admise par métrique segmentaire lorsque le bilan global est amélioré ; au-delà, une amélioration moyenne ne compense pas un échec segmentaire.
