# 🚀 Roadmap : Élévation Backend IdentiGuinéeV2

Ce document trace le chemin pour transformer le backend actuel en un système de niveau industriel (Haut Niveau).

## 🎯 Objectifs
- Passer au traitement **100% asynchrone** avec Celery.
- Garantir une **sécurité maximale** (Zero Trust, Signature HMAC).
- Atteindre une **couverture de tests de 80%+** sur la logique métier.
- Offrir une **documentation API parfaite** via OpenAPI 3.1.

---

## 🛠️ Phase 1 : Architecture & Fondations
- [ ] **Exceptions Métier** : Créer `apps/common/exceptions.py` pour standardiser les erreurs.
- [ ] **Handler Unifié** : Améliorer `config/exception_handler.py` pour gérer les nouveaux codes d'erreur.
- [ ] **Type Hinting** : Passer en revue tous les services pour un typage Python strict.

## ⚙️ Phase 2 : Pipeline Celery & Automatisation
- [ ] **Setup Celery** : Configurer `config/celery.py` et le broker Redis.
- [ ] **Tasks Documents** : Créer `apps/documents/tasks.py`.
- [ ] **Refacto Services** : Séparer la création de demande du traitement lourd.
- [ ] **Monitoring** : (Optionnel) Intégrer Flower pour suivre les tâches.

## 📄 Phase 3 : Certification & Documents
- [ ] **Générateur PDF** : Implémenter la classe `PDFGenerator` avec WeasyPrint.
- [ ] **QR Code Service** : Ajouter la génération de QR codes sécurisés.
- [ ] **Signature Crypto** : Utiliser HMAC-SHA256 pour sceller l'intégrité des PDF.

## 🚀 Phase 4 : Performance & Sécurité
- [ ] **Managers Custom** : Implémenter `with_prefetches()` dans `documents/managers.py`.
- [ ] **Rate Limiting** : Protéger `/auth/` et `/verification/` contre les attaques par force brute.
- [ ] **OpenAPI** : Configurer `drf-spectacular` et documenter chaque endpoint.

## 🧪 Phase 5 : Qualité Logicielle
- [ ] **Factories** : Créer `apps/documents/tests/factories.py`.
- [ ] **Tests Services** : Écrire les tests pour le pipeline de traitement.
- [ ] **Tests API** : Valider les permissions et les formats de réponse.

---

## 📝 Commandes Utiles
- **Lancer Celery** : `celery -A config worker -l info`
- **Lancer les Tests** : `pytest --cov=apps`
- **Générer Schéma API** : `python manage.py spectacular --file schema.yml`

---
*Généré par Antigravity pour le projet IdentiGuinéeV2.*
