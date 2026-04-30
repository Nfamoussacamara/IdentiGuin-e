# Module Common : Utilitaires & Standards Globaux

Ce module regroupe les composants transversaux utilisés par toutes les autres applications du projet IdentiGuinéeV2.

## ⚠️ Gestion des Exceptions

Le fichier `exceptions.py` définit la hiérarchie des erreurs métier :
*   `IdentiGuineeError` : Classe de base pour toutes nos erreurs.
*   Chaque erreur possède un `code` (ex: `AUTH_001`) et un `message` lisible.

Le handler central dans `config/exception_handler.py` transforme automatiquement ces erreurs en réponses JSON standardisées pour le frontend.

## 🛡️ Sécurité & Rate Limiting

Le fichier `views.py` contient la vue de rejet `ratelimit_error`.
Elle assure que les attaquants reçoivent une réponse structurée (429 Too Many Requests) sans divulguer d'informations sensibles sur le serveur.

---
*Documentation générée par Antigravity - Équipe IdentiGuinée V2*
