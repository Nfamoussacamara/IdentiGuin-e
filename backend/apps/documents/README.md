# Module Documents : Certification & Pipeline Asynchrone

Ce module est le cœur métier du système IdentiGuinéeV2. Il gère la demande, la validation, la signature cryptographique et la délivrance des documents officiels guinéens.

## 🏗️ Architecture Technique

Le module suit une séparation stricte des responsabilités (Principes SOLID) :

1.  **Vues (HTTP)** : Reçoivent les demandes et délèguent immédiatement au service.
2.  **Services (Logique Métier)** : Orchestrent la création et déclenchent les tâches de fond.
3.  **Tâches (Asynchrone)** : Exécutent les calculs lourds (Blockchain, PDF) sans bloquer l'utilisateur.
4.  **Générateurs** : Responsables du rendu visuel et de la certification des fichiers.

## 🚀 Pipeline de Traitement

Lorsqu'une demande est créée, elle suit le flux suivant :
1.  **Réception** : Enregistrement en base de données avec statut `RECUE`.
2.  **Mise en file d'attente** : Envoi de l'ID à Celery via Redis.
3.  **Ancrage Blockchain** : Simulation d'une transaction sur NaissanceChain (via `web3`).
4.  **Génération PDF** :
    *   Création d'un **QR Code** de vérification.
    *   Calcul d'une **Signature HMAC** (scellé numérique).
    *   Rendu via **WeasyPrint**.
5.  **Finalisation** : Stockage du fichier et mise à jour du statut à `PRET`.

## 🛠️ Composants Clés

### `generators.py`
Contient la classe `DocumentGenerator`. Elle utilise WeasyPrint pour transformer le template `certificat.html` en PDF officiel.
> **Note** : Le QR code est injecté en Base64 pour garantir la portabilité du document.

### `managers.py`
Contient le `DemandeManager` optimisé.
*   Utiliser `.optimisé()` pour éviter le problème SQL N+1.
*   Utiliser `.pour_citoyen(user)` pour les requêtes filtrées.

### `tasks.py`
Définit la tâche `pipeline_traitement_document_task`.
*   Supporte le **Retry automatique** (3 tentatives) en cas de timeout API ou DB.

## 🛡️ Sécurité

*   **Rate Limiting** : Les endpoints de création et de vérification sont protégés par `django-ratelimit` (limite configurable dans Redis).
*   **Signature HMAC** : Chaque document est scellé avec la `SECRET_KEY` du serveur, rendant toute modification du PDF détectable.

## 🧪 Tests Unitaires

Pour lancer les tests du module :
```bash
python -m pytest apps/documents/tests/
```
Les tests couvrent :
*   La création de demande avec profil complet/incomplet.
*   Le déclenchement correct de la tâche Celery (Mocking).
*   La robustesse face aux IDs citoyens inexistants.

---
*Documentation générée par Antigravity - Équipe IdentiGuinée V2*
