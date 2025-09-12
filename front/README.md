# Background Remover Application

Une application web moderne de suppression d'arrière-plan d'images utilisant l'intelligence artificielle, construite avec Next.js et FastAPI.

## ✨ Fonctionnalités Implémentées

### 🔐 Système d'Authentification
- **Google OAuth** via NextAuth.js
- Interface responsive desktop/mobile
- Gestion des sessions JWT
- Pages d'erreur personnalisées
- Menu utilisateur avec déconnexion

### 📊 Gestion des Quotas
- **Quotas journaliers** : 5 images/jour (anonyme), 20 images/jour (connecté)
- **Affichage en temps réel** avec barre de progression colorée
- **Reset automatique** à minuit
- **Stockage par IP** (anonyme) ou email (connecté)

### 🖼️ Traitement d'Images
- **Upload drag & drop** avec validation (JPEG, PNG, WebP jusqu'à 10MB)
- **Prévisualisation avant/après** côte à côte
- **Intégration FastAPI** pour le traitement ML
- **Gestion d'erreurs** complète avec messages utilisateur

### 🎨 Interface Utilisateur
- **Thème sombre** moderne avec Tailwind CSS 4
- **Design responsive** mobile-first
- **Animations fluides** avec effets de fade-in
- **Composants réutilisables** bien structurés

## 🏗️ Architecture Technique

### Stack Technologique
- **Frontend** : Next.js 15 + React 19 + TypeScript
- **Styling** : Tailwind CSS 4
- **Auth** : NextAuth.js + Google OAuth
- **Backend ML** : FastAPI (Azure Container Apps)
- **Déploiement** : Vercel (frontend) + Azure (backend)

### Structure du Projet
```
/app
├── /api                    # API Routes
│   ├── /auth/[...nextauth] # NextAuth configuration
│   ├── /quotas            # Gestion des quotas
│   └── /remove-background # Traitement des images
├── /auth                  # Pages d'authentification
├── layout.tsx             # Layout principal
└── page.tsx               # Page d'accueil

/components                # Composants React
├── AuthProvider.tsx       # Provider de session
├── DesktopAuth.tsx       # Interface auth desktop
├── MobileMenu.tsx        # Menu mobile
├── Header.tsx            # Navigation
├── ImageUpload.tsx       # Upload d'images
├── ImagePreview.tsx      # Prévisualisation
└── QuotaDisplay.tsx      # Affichage des quotas

/lib
├── api.ts                # Fonctions API client
└── quotas.ts             # Logique des quotas

/hooks
└── useQuotas.ts          # Hook de gestion des quotas
```

## 🚀 Installation et Développement

### Prérequis
- Node.js 18+
- npm, yarn, pnpm ou bun

### Variables d'Environnement
Créer un fichier `.env.local` :
```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# FastAPI Backend
FASTAPI_URL=https://your-fastapi-url
FASTAPI_SECRET_KEY=your_api_key
```

### Commandes
```bash
# Installation
npm install

# Développement
npm run dev

# Build
npm run build

# Lancement
npm start
```

## 📋 Infrastructure Actuelle vs Future

### 🏃‍♂️ État Actuel
```
Frontend (Next.js/Vercel)
├── Auth : Google OAuth ✅
├── Quotas : Stockage mémoire ✅
├── UI : Responsive + dark theme ✅
└── Pages : Upload + Preview ✅

Next.js Backend (API Routes)
├── /api/auth : NextAuth Google OAuth ✅
├── /api/quotas : Gestion des limites ✅
├── /api/remove-background : Orchestration ✅
│   ├── Validation fichiers ✅
│   ├── Vérification quotas ✅
│   ├── Appel FastAPI ✅
│   └── Gestion réponses ✅

External Services
├── FastAPI : Endpoint /process-image uniquement ✅
│   └── Traitement ML pur (input: image → output: image)
└── Azure Container Apps : Hébergement FastAPI ✅

Limitations actuelles :
❌ Quotas perdus au redémarrage serveur
❌ Pas d'historique des images
❌ Pas de stockage persistant
```

### 🎯 Infrastructure Future Planifiée

```
Frontend (Next.js/Vercel)
├── Auth (NextAuth + Google) ✅
├── UI Components ✅
└── New Features:
    ├── 📁 Galerie d'images utilisateur
    ├── ⬇️ Téléchargement ZIP
    └── 📊 Historique des traitements

Next.js Backend (API Routes Extended)
├── /api/auth : NextAuth ✅
├── /api/quotas : Convex integration
├── /api/remove-background : Enhanced ✅
│   ├── Upload → Azure Blob
│   ├── Process via FastAPI ✅
│   ├── Save result → Azure Blob
│   └── Store metadata → Convex
├── /api/user-images : Gallery endpoint
├── /api/upload-to-blob : Direct upload
└── /api/download-images : ZIP generation

Database (Convex DB)
├── 👤 users (id, email, plan, createdAt)
├── 📊 quotas (userId/ip, usage, lastReset) 
└── 🖼️ images (userId, originalUrl, processedUrl, metadata, createdAt)

Storage (Azure Blob Storage)
├── 📦 Container: "original-images"
└── 📦 Container: "processed-images"

External Services (Unchanged)
├── 🤖 FastAPI : /process-image endpoint ✅
│   └── Pure ML service (image → processed image)
└── Azure Container Apps : FastAPI hosting ✅
```

### 🔄 Flux de Données Future
```
1. User upload → Next.js API → Azure Blob (original)
2. Next.js API → FastAPI /process-image (avec Blob URL)
3. FastAPI → Retourne image traitée à Next.js
4. Next.js → Sauvegarde result dans Azure Blob (processed)
5. Next.js → Store metadata dans Convex DB
6. User gallery → Next.js API → Convex queries → UI
7. Download → Next.js génère signed URLs Azure
```

### 🎯 Responsabilités par Service
```
Next.js Backend :
├── 🛡️ Auth & Security (sessions, quotas)
├── 🗄️ Data Management (Convex, Azure Blob)
├── 🔄 Orchestration (workflow complet)
└── 📁 File Management (upload, download, gallery)

FastAPI :
└── 🤖 Pure ML Processing (image → processed image)

Convex DB :
├── 👤 User data & quotas
└── 📊 Image metadata & history

Azure Blob :
└── 🖼️ Image storage (original + processed)
```

## 📝 Tâches Restantes

### 🔥 Priorité Haute
- [ ] **Migration Convex** : Remplacer le stockage mémoire des quotas
- [ ] **Azure Blob Storage** : Configuration et intégration
- [ ] **Schema Database** : Tables users, quotas, images
- [ ] **Upload API** : Endpoint pour sauvegarder les images

### 🚀 Fonctionnalités Utilisateur  
- [ ] **Galerie personnelle** : Affichage des images par utilisateur
- [ ] **Téléchargement** : ZIP multiple ou individuel
- [ ] **Historique** : Liste des traitements avec dates
- [ ] **Pagination** : Pour grandes collections d'images

### 🛠️ Améliorations Techniques
- [ ] **Gestion d'erreurs** : Retry logic pour Azure Blob
- [ ] **Optimisations** : Compression/redimensionnement avant upload
- [ ] **Monitoring** : Logs et métriques des traitements
- [ ] **Tests** : Suite de tests automatisés

### 🎨 UX/UI
- [ ] **Loading states** : Indicateurs de progression upload
- [ ] **Prévisualisation** : Thumbnails dans la galerie
- [ ] **Filtres** : Tri par date, taille, statut
- [ ] **Notifications** : Toast pour succès/erreurs

## 🔧 Configuration Actuelle

### Quotas
- **Anonymes** : 5 images/jour (par IP)
- **Connectés** : 20 images/jour (par email)
- **Reset** : Minuit automatique
- **Storage** : Map mémoire (temporaire)

### Validation Fichiers
- **Formats** : JPEG, PNG, WebP
- **Taille max** : 10MB
- **Sécurité** : Validation côté client et serveur

### Performance
- **Build time** : ~19.5s
- **Bundle size** : 131KB (shared)
- **Images** : Optimisation Next.js recommandée

## 🚀 Déploiement

L'application est prête pour le déploiement sur Vercel avec la configuration actuelle. Pour la version complète avec Azure Blob Storage et Convex, voir les tâches restantes ci-dessus.

### Build Warnings à Corriger
- Remplacer `<img>` par `<Image />` de Next.js
- Ajouter `alt` props manquants
- Nettoyer variables inutilisées