# Plan d'Action Phase 2 — IdentiGuinée (Demi-finale)

Ce document suit l'état d'avancement des fonctionnalités requises pour la Phase 2 du Hackathon MIABE 2026.

---

## 01 — État des Lieux (Ce qui est FAIT) ✅
- [x] **Socle Backend :** Django 5 + DRF configuré de façon modulaire.
- [x] **Gestion des Citoyens :** Inscription, connexion JWT et profil complet.
- [x] **Pipeline Automatisé :** Système de demande capable de passer de "Reçue" à "Prêt" sans humain.
- [x] **Intégration Blockchain :** Signature cryptographique et Hash NaissanceChain (Mock).
- [x] **Tests de Flux :** Validation réussie du cycle complet Inscription -> Demande -> Blockchain.

---

## 02 — Étape A : Génération PDF Certifié 📄
*Objectif : Transformer la donnée en un document officiel téléchargeable.*

- [ ] **Templates HTML/CSS :** Créer des modèles élégants pour la CNI et l'Extrait de Naissance (Armoiries, filigranes).
- [ ] **Moteur WeasyPrint :** Intégrer la génération PDF dans le pipeline Celery.
- [ ] **Composant QR Code :** Générer dynamiquement le QR code pointant vers l'URL de vérification.

---

## 03 — Étape B : Portail de Vérification Publique 🔍
*Objectif : Permettre aux administrations de vérifier un document.*

- [ ] **Endpoint de Vérification :** Route publique `GET /verification/{token}/`.
- [ ] **Affichage des Preuves :** Montrer le Hash Blockchain et l'authenticité sans révéler trop de données privées.

---

## 04 — Étape C : Portail Web Citoyen (Frontend React) 💻
*Objectif : L'interface utilisateur pour la démo live.*

- [ ] **Dashboard Citoyen :** Vue d'ensemble des demandes.
- [ ] **Formulaire de Demande :** Interface simple pour choisir son document et uploader les pièces.
- [ ] **Suivi Temps Réel :** Barre de progression montrant l'étape Blockchain en direct.

---

## 05 — Étape D : Tableau de Bord Admin 📊
*Objectif : Montrer l'impact social au jury.*

- [ ] **KPIs Corruption :** Compteur de pots-de-vin évités (Nombre de demandes x estimation pot-de-vin moyen).
- [ ] **Flux Blockchain :** Liste en temps réel des transactions NaissanceChain.

---

## 06 — Préparation de la Démo "2 Minutes" ⏱️
- [ ] Scénario de test : Inscription -> Paiement (Simulé) -> Traitement -> Téléchargement.
- [ ] Vérification finale sur le Testnet Polygon Amoy (Optionnel).

---

> [!TIP]
> **Priorité immédiate :** Étape A (Génération PDF) car c'est le livrable "physique" le plus important pour prouver que le système fonctionne.
