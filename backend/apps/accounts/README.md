# Module Accounts : Gestion de l'Identité Numérique

Ce module gère les citoyens guinéens, leur authentification (JWT) et la validation de leur profil civil.

## 👤 Modèle CitoyenUser

Le modèle `CitoyenUser` étend `AbstractUser` de Django et ajoute les champs spécifiques à la République de Guinée :
*   `numero_citoyen` : ID unique généré automatiquement.
*   `numero_registre_naissance` : Identifiant pivot pour NaissanceChain.
*   `profil_complet` : Propriété calculée vérifiant si le citoyen peut faire des demandes officielles.

## 💼 Couche Service

Toute la logique de création et de modification des utilisateurs se trouve dans `services.py`.
*   **Atomicité** : Les inscriptions sont protégées par `transaction.atomic()`.
*   **Documentation** : Toutes les fonctions sont typées et documentées selon les standards Google.

## ⚡ Optimisations

Le `CitoyenManager` inclut des méthodes pour optimiser les performances :
*   `.avec_demandes()` : Pré-charge toutes les demandes du citoyen en une seule requête SQL.
*   `.verifies()` : Filtre les citoyens ayant déjà passé l'audit NaissanceChain.

---
*Documentation générée par Antigravity - Équipe IdentiGuinée V2*
