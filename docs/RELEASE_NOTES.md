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
