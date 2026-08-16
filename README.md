# Wine Blind — V11.1.0

Version de production candidate reconstruite à partir du dernier frontend complet **V10.7.2** et du moteur de release **C2-C2**.

## Principe

- `app.js`, `styles.css`, `data.js`, `v106.js`, `v107.js`, `v108.js` et `tree.js` conservent l'interface et les fonctions historiques.
- `c2c2-data.js` contient la candidate C2-C2 gelée.
- `c2c2-engine.js` exécute C2-C2.
- `v11-reset-patch.js` relie la saisie historique au moteur C2-C2 et applique uniquement les ajustements UX validés.
- `v11-reset.css` complète le stylesheet historique sans le remplacer.

Le moteur C2-C2 n'est pas recalibré dans cette release.

Voir `docs/ARCHITECTURE.md`, `docs/RELEASE_NOTES.md` et `docs/QA_REPORT.md`.
