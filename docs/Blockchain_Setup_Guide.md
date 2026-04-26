# Guide de Configuration Blockchain — IdentiGuinée

Ce document regroupe toutes les ressources et étapes nécessaires pour passer du mode simulation (**Mock**) au mode réel sur le réseau de test (**Testnet**) Polygon Amoy.

---

## 01 — Portefeuille (Wallet) & Identité
Pour interagir avec la blockchain, vous avez besoin d'un portefeuille numérique.

*   **Outil :** [MetaMask](https://metamask.io/) (Extension navigateur Chrome/Brave/Firefox)
*   **Action :** Créer un nouveau portefeuille, noter précieusement la "Seed Phrase" (12 mots) hors ligne.
*   **Utilité :** C'est ce portefeuille qui déploiera les Smart Contracts et signera les transactions d'IdentiGuinée.

---

## 02 — Configuration du Réseau (Amoy Testnet)
Par défaut, MetaMask est sur le réseau Ethereum. Il faut ajouter le réseau de test de Polygon.

*   **Lien direct :** [Chainlist - Polygon Amoy](https://chainlist.org/?testnets=true&search=Amoy)
*   **Action :** Cliquer sur "Connect Wallet" puis "Add to MetaMask".
*   **Détails techniques (si ajout manuel) :**
    *   *Nom du réseau :* Polygon Amoy Testnet
    *   *RPC URL :* `https://rpc-amoy.polygon.technology`
    *   *ID de chaîne :* 80002
    *   *Symbole :* MATIC

---

## 03 — Obtention de Jetons Gratuits (Faucets)
Le déploiement sur le Testnet est gratuit, mais nécessite des jetons "fictifs" pour simuler les frais de réseau (Gas).

*   **Option 1 (Officiel) :** [Polygon Faucet](https://faucet.polygon.technology/)
*   **Option 2 (Alchemy) :** [Alchemy Amoy Faucet](https://www.alchemy.com/faucets/polygon-amoy)
*   **Action :** Coller votre adresse MetaMask (commence par `0x...`) et valider. Vous recevrez des MATIC de test en quelques secondes.

---

## 04 — Infrastructure & Noeud RPC
Le backend Django a besoin d'une URL pour "parler" à la blockchain sans avoir à faire tourner un serveur blockchain complet sur votre PC.

*   **Fournisseur recommandé :** [Alchemy](https://www.alchemy.com/) (Créer un compte gratuit)
*   **Action :** 
    1. Créer une "App" dans le tableau de bord Alchemy.
    2. Choisir le réseau **Polygon Amoy**.
    3. Copier l'**HTTPS URL** fournie (nécessaire pour la variable `NAISSANCECHAIN_RPC_URL`).

---

## 05 — Configuration du Projet (.env)
Une fois les étapes précédentes terminées, mettez à jour votre fichier `.env` à la racine du serveur :

```env
# Passer en mode réel (Testnet)
NAISSANCECHAIN_USE_MOCK=False

# URL obtenue sur Alchemy (Etape 04)
NAISSANCECHAIN_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/VOTRE_CLE_ICI

# Clé privée de votre MetaMask (NE JAMAIS PARTAGER !)
# (Dans MetaMask : Détails du compte > Exporter la clé privée)
NAISSANCECHAIN_PRIVATE_KEY=votre_cle_privee_secrete

# Adresse du Smart Contract après déploiement (Phase 2)
NAISSANCECHAIN_CONTRACT_ADDRESS=0x...
```

---

## 06 — Outils d'Exploration
Pour vérifier que vos transactions sont bien enregistrées, vous pouvez utiliser l'explorateur de blocs public :

*   **Explorateur Amoy :** [OKLink Polygon Amoy Explorer](https://www.oklink.com/amoy)
*   **Action :** Coller votre adresse de contrat ou un Hash de transaction pour voir les détails en temps réel.

---

> [!IMPORTANT]
> Pour la **Phase 1 (Présélection)**, la configuration **Mock** (simulée) est suffisante et recommandée pour éviter les problèmes de réseau lors des démos. Ce guide est destiné à la préparation de la **Phase 2 (MVP)**.
