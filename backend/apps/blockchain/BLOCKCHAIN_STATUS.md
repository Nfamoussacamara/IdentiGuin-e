# État de l'Intégration Blockchain — IdentiGuinée

Ce document récapitule l'infrastructure blockchain déployée lors de la Phase 2 pour la certification des actes de naissance.

---

## 🏗️ Architecture Déployée
Le système utilise désormais une architecture **Web3 réelle** sur le réseau **Polygon Amoy**.

*   **Réseau :** Polygon Amoy Testnet (ID: 80002)
*   **Smart Contract :** `NaissanceChain.sol` (v1.0)
*   **Adresse du Contrat :** `0x734919922f22231b32E8e45Ce28c4d471D4ac486`
*   **Lien Explorateur :** [PolygonScan Amoy - NaissanceChain](https://amoy.polygonscan.com/address/0x734919922f22231b32E8e45Ce28c4d471D4ac486)

---

## 🔑 Configuration du Portefeuille (Owner)
Le contrat appartient exclusivement à l'adresse suivante :
*   **Wallet Admin :** `0x5c134A787339392F54E43aA9f01826e84f347AD3`
*   **Propriété :** Seule cette adresse peut effectuer des signatures et payer les frais de gaz pour l'enregistrement des actes.

---

## ⚙️ Intégration Django
Le serveur communique avec la blockchain via l'adaptateur **`Web3NaissanceChainAdapter`**.

### Variables d'environnement (.env)
```env
NAISSANCECHAIN_CONTRACT_ADDRESS=0x734919922f22231b32E8e45Ce28c4d471D4ac486
NAISSANCECHAIN_USE_MOCK=False
NAISSANCECHAIN_RPC_URL=https://rpc-amoy.polygon.technology
NAISSANCECHAIN_PRIVATE_KEY=votre_cle_privee
```

---

## 🔒 Sécurité & Bonnes Pratiques (CRITIQUE)
### Gestion de la Clé Privée
*   **NE JAMAIS** commiter le fichier `.env` sur Git.
*   **Accès restreint :** Seul le serveur de production et l'administrateur principal (Nfamoussa) doivent posséder la `NAISSANCECHAIN_PRIVATE_KEY`.
*   **Isolation :** Le portefeuille utilisé pour IdentiGuinée doit être un portefeuille dédié, contenant uniquement le MATIC nécessaire aux opérations (ne pas y stocker d'autres actifs personnels).

---

## 📄 Logique du Smart Contract (Solidity)
Le contrat `NaissanceChain.sol` est un registre de preuves d'existence (Proof of Existence).

1.  **`recordNaissance(string docHash, string metadata)`** :
    *   Prend le hash SHA-256 du document.
    *   Vérifie si ce hash existe déjà (anti-doublon).
    *   Stocke le timestamp immuable de la blockchain.
2.  **`verifyNaissance(string docHash)`** :
    *   Fonction publique et gratuite (view).
    *   Permet à n'importe quel citoyen de vérifier l'authenticité d'un acte via son portail de vérification.

---

## 🛠️ Guide du Développeur (Collaborateurs)

### Comment redéployer le contrat ?
Si vous modifiez le code Solidity dans `contracts/`, suivez cette procédure :
1.  Assurez-vous que le portefeuille a assez de MATIC.
2.  Exécutez : `.venv\Scripts\python.exe apps/blockchain/scripts/deploy.py`.
3.  Le script générera un nouveau fichier `contract_info.json` et affichera la nouvelle adresse.
4.  Mettez à jour `NAISSANCECHAIN_CONTRACT_ADDRESS` dans le `.env`.

### Dépendances nécessaires
*   `web3` : Pour la communication blockchain.
*   `py-solc-x` : Pour la compilation Solidity automatique.

---

## ✅ Historique & Preuves
*   **Premier bloc de déploiement :** [37336830](https://amoy.polygonscan.com/block/37336830)
*   **Première certification :** Transaction `0x1e1ccdfafb6e82388f070ec650f19087d9c19b466489ae6341f0259444093476`

---

## 🛠️ Maintenance & Prochaines Étapes
*   **Recharge de Gaz :** Surveiller le solde MATIC de l'adresse admin sur PolygonScan.
*   **Vérification Publique :** Implémenter le portail de vérification qui lira directement sur le contrat via l'adresse du document.
