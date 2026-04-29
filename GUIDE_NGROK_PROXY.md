# 🌐 Tout savoir sur ngrok : De la Théorie à la Pratique

Ce guide est conçu pour vous expliquer ce qu'est **ngrok** et comment l'utiliser de A à Z pour rendre votre projet local accessible au monde entier.

---

## 🛠️ Partie 1 : C'est quoi ngrok ?

Imaginez que votre ordinateur est une maison fermée à clé. Votre projet tourne à l'intérieur de cette maison sur une adresse que vous seul pouvez voir : `http://localhost:5173`.

**ngrok** est comme un **tunnel magique et sécurisé** que vous creusez entre votre maison et la rue (Internet). 
- Il prend votre adresse locale (`localhost`) et lui donne une adresse publique (ex: `https://votre-projet.ngrok-free.app`).
- N'importe qui dans le monde avec ce lien peut désormais "entrer" dans votre tunnel pour voir votre projet, sans que vous ayez besoin de configurer votre routeur ou d'acheter un serveur.

🔗 **Lien utile** : [Site officiel ngrok](https://ngrok.com/)

---

## 🚀 Partie 2 : Mise en pratique détaillée

Voici exactement le processus à suivre pour exposer un projet Full-Stack.

### 1. Installation et Préparation
Installez l'outil et ajoutez votre "clé" (authtoken) récupérée sur votre tableau de bord.
```powershell
npm install ngrok
npx ngrok config add-authtoken VOTRE_TOKEN_SECRET
```
🔗 **Lien utile** : [Récupérer votre Authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)

### 2. Le défi technique (Le "Casse-tête")
Un projet moderne a souvent deux moteurs :
- **Le Frontend (Vite)** : Port 5173.
- **Le Backend (Django/Node)** : Port 8000.

**Le problème** : La version gratuite de ngrok ne permet de creuser qu'**un seul tunnel**. Si on expose le Front, le Back reste caché.

### 3. La solution : La "Centrale d'Aiguillage" (Vite Proxy)
Pour résoudre ce problème, on transforme le serveur **Vite** en un intermédiaire intelligent.

#### A. Lever les barrières de sécurité
On autorise Vite à accepter les connexions venant de ngrok :
```typescript
// vite.config.ts
server: {
  allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev']
}
```

#### B. Créer le passage secret (Proxy)
On configure Vite pour qu'il téléporte les requêtes API vers le Backend.
```typescript
// vite.config.ts
proxy: {
  '/api/v1': {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
  }
}
```
🔗 **Lien utile** : [Documentation Vite Proxy](https://vitejs.dev/config/server-options.html#server-proxy)

#### C. Rendre les chemins "relatifs"
Dans le code de l'API, on utilise des chemins relatifs (`/api/v1`) au lieu d'URLs absolues. Cela permet à l'application de s'adapter automatiquement à l'URL ngrok.

---

## 🏁 Résultat Final : Comment ça tourne ?

1. **Le Backend** tourne sur le port 8000.
2. **Le Frontend** tourne sur le port 5173 (avec son rôle de proxy).
3. **ngrok** crée le tunnel vers le port 5173.

**L'expérience utilisateur** :
L'utilisateur ouvre l'URL ngrok. Son appareil demande la page à Vite. Toutes les actions qui demandent des données sont envoyées à l'URL ngrok, puis Vite les passe instantanément au Backend en local.

**C'est propre, c'est pro, et ça ne coûte rien !**

---
*Document pédagogique réalisé pour l'équipe de développement.*
