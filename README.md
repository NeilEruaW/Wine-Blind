# Wine Blind — V11.6.0

Version de production candidate reconstruite à partir du dernier frontend complet **V10.7.2** et du moteur de release **C2-C2**.

## Principe

- `app.js`, `styles.css`, `data.js`, `v106.js`, `v107.js`, `v108.js` et `tree.js` conservent l'interface et les fonctions historiques.
- `c2c2-data.js` contient la candidate C2-C2 gelée.
- `c2c2-engine.js` exécute les profils régionaux C2-C2 pour le diagnostic d’origine.
- `canonical-profile-runtime.js` matérialise les 98 profils cépages depuis l’unique source des fiches d’identité.
- `canonical-probability-model.js` calcule les probabilités du Top 10 cépages sur ces 98 profils.
- `origin-probability-model.js` calcule les probabilités hiérarchiques du Top 10 origines sur 203 profils régionaux, pour les périmètres Monde et France.
- `v11-reset-patch.js` relie la saisie historique au moteur C2-C2 et applique uniquement les ajustements UX validés.
- `v11-reset.css` complète le stylesheet historique sans le remplacer.

Les 13 cépages sans véritable profil régional restent volontairement exclus du Top 10 origines.

Voir `docs/ARCHITECTURE.md`, `docs/RELEASE_NOTES.md` et `docs/QA_REPORT.md`.
