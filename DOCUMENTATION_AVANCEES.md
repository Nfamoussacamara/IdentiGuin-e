# 📝 Documentation Technique : Avancées IdentiGuinéeV2

Cette documentation résume les travaux réalisés pour moderniser la plateforme **IdentiGuinéeV2**, améliorer l'expérience utilisateur et permettre une démonstration en direct via Internet.

---

## 🚀 1. Modernisation de l'Interface (Frontend)

Nous avons transformé le formulaire de demande de documents en une expérience fluide et interactive.

### ✨ Points Clés :
- **Flux Multi-étapes** : Utilisation de `AnimatePresence` (Framer Motion) pour des transitions fluides entre la sélection du document et le remplissage du formulaire.
- **Gestion des Fichiers** : Implémentation d'un système de téléversement (Drag & Drop ou sélection) avec affichage du nombre de fichiers et de leurs noms.
- **États de Chargement** : Ajout d'indicateurs visuels (`Loader2`) lors de la soumission pour éviter les doubles clics.

---

## ⚙️ 2. Service de Vérification (Backend)

Côté serveur, nous avons posé les bases de la vérification de documents automatisée.

- **Nouvel Endpoint** : Création de la route `/api/v1/verification/rechercher/`.
- **Architecture** : Intégration d'une vue Django (`VerifierDocumentView`) dédiée à la recherche et à la validation des documents.

---

## 🌐 3. Exposition Internet & Tunneling (ngrok)

Pour permettre à des amis de tester l'application sur mobile ou à distance, nous avons mis en place un tunnel sécurisé.

### 🛠️ Configuration du Proxy Vite
Au lieu de lancer deux tunnels ngrok (limite gratuite), nous avons configuré un **Vite Proxy**.

**Comment ça marche ?**
1. Le tunnel ngrok pointe uniquement sur le **Frontend (port 5173)**.
2. Vite détecte les appels API commençant par `/api/v1` et les redirige automatiquement vers le **Backend local (port 8000)**.

---

## 📂 4. Gestion de Version (Git)

Toutes les modifications ont été sauvegardées suivant les standards professionnels.

- **Message de commit** : `feat: implémentation du flux de demande de documents et service de vérification`
- **Branche** : `main`

---

## 🛠️ Comment lancer la démo ?

Pour reproduire cet environnement de test :

1. **Lancer le Backend** : `python manage.py runserver` (dans `/serveur`)
2. **Lancer le Frontend** : `npm run dev` (dans `/client`)
3. **Ouvrir le Tunnel** : `npx ngrok http 5173`
4. **Partager** : Envoyez l'URL ngrok à vos amis !

---

*Document généré avec ❤️ par Antigravity pour le projet IdentiGuinéeV2.*
