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
- **Sauvegarde Azure Blob Storage** pour utilisateurs authentifiés
- **Gestion d'erreurs** complète avec messages utilisateur

### 🖼️ Galerie d'Images
- **Galerie personnelle** pour utilisateurs connectés avec thumbnails
- **Recherche et filtres** par titre, tags, favoris
- **Gestion d'images** : édition titre/tags, marquer favoris, suppression
- **Modal d'affichage** avec download original/processed
- **Pagination** pour grandes collections

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
- **Database** : PostgreSQL + Prisma ORM
- **Storage** : Azure Blob Storage (images + thumbnails)
- **Backend ML** : FastAPI (Azure Container Apps)
- **Déploiement** : Vercel (frontend) + Azure (backend)

### Structure du Projet
```
/app
├── /api                    # API Routes
│   ├── /auth/[...nextauth] # NextAuth configuration
│   ├── /quotas            # Gestion des quotas
│   ├── /remove-background # Traitement des images
│   └── /images            # API galerie (GET/PATCH/DELETE)
├── /auth                  # Pages d'authentification
├── /gallery               # Page galerie utilisateur
├── layout.tsx             # Layout principal
└── page.tsx               # Page d'accueil

/components                # Composants React
├── AuthProvider.tsx       # Provider de session
├── DesktopAuth.tsx       # Interface auth desktop
├── MobileMenu.tsx        # Menu mobile
├── Header.tsx            # Navigation
├── ImageUpload.tsx       # Upload d'images
├── ImagePreview.tsx      # Prévisualisation
├── QuotaDisplay.tsx      # Affichage des quotas
├── ImageGallery.tsx      # Galerie principale
├── ImageCard.tsx         # Cartes d'images
├── GalleryFilters.tsx    # Filtres et recherche
└── ImageModal.tsx        # Modal d'affichage/édition

/lib
├── api.ts                # Fonctions API client + galerie
├── quotas.ts             # Logique des quotas
├── azure-storage.ts      # Utilitaires Azure Blob Storage
└── prisma.ts             # Configuration Prisma client

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

# Database
DATABASE_URL=postgresql://...

# FastAPI Backend
FASTAPI_URL=https://your-fastapi-url
FASTAPI_SECRET_KEY=your_api_key

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net
```

### Commandes
```bash
# Installation
npm install

# Base de données
npx prisma generate    # Générer le client Prisma
npx prisma db push     # Mettre à jour le schéma

# Développement
npm run dev

# Build
npm run build

# Lancement
npm start
```

## 📋 Infrastructure Actuelle vs Future

### 🏃‍♂️ État Actuel - IMPLÉMENTÉ ✅
```
Frontend (Next.js/Vercel)
├── Auth : Google OAuth ✅
├── Quotas : Base de données PostgreSQL ✅
├── UI : Responsive + dark theme ✅
├── Pages : Upload + Preview + Gallery ✅
└── Gallery : Galerie utilisateur complète ✅

Next.js Backend (API Routes)
├── /api/auth : NextAuth Google OAuth ✅
├── /api/quotas : Gestion des limites ✅
├── /api/remove-background : Orchestration complète ✅
│   ├── Validation fichiers ✅
│   ├── Vérification quotas ✅
│   ├── Appel FastAPI ✅
│   ├── Sauvegarde Azure Blob Storage ✅
│   └── Création records database ✅
└── /api/images : CRUD galerie ✅
    ├── GET : Liste avec pagination/filtres ✅
    ├── GET /[id] : Détails avec SAS URLs ✅
    ├── PATCH /[id] : Édition métadonnées ✅
    └── DELETE /[id] : Suppression complète ✅

Database (PostgreSQL + Prisma)
├── Users : Comptes OAuth ✅
├── UserQuota : Limites et usage ✅
├── QuotaUsage : Historique d'utilisation ✅
└── UserImage : Métadonnées images + Azure URLs ✅

Storage (Azure Blob Storage)
├── Container : originals (images source) ✅
├── Container : processed (images traitées) ✅
├── Container : thumbnails (aperçus WebP) ✅
└── SAS URLs : Accès sécurisé temporaire ✅

External Services
├── FastAPI : Endpoint /process-image ✅
│   └── Traitement ML pur (input: image → output: image)
└── Azure Container Apps : Hébergement FastAPI ✅

✅ FONCTIONNALITÉS COMPLÈTES :
✅ Persistance complète (database + storage)
✅ Galerie utilisateur avec gestion d'images
✅ Recherche, filtres, pagination
✅ Upload → Traitement → Sauvegarde → Galerie
✅ Download original + processed
✅ Gestion métadonnées (titre, tags, favoris)
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

### ✅ TÂCHES TERMINÉES
- [x] **Azure Blob Storage** : Configuration et intégration complète
- [x] **Schema Database** : Tables users, quotas, images avec Prisma
- [x] **Upload API** : Endpoint pour sauvegarder les images
- [x] **Galerie personnelle** : Affichage des images par utilisateur
- [x] **Historique** : Liste des traitements avec dates
- [x] **Pagination** : Pour grandes collections d'images
- [x] **Recherche et filtres** : Par titre, tags, favoris
- [x] **Gestion d'images** : Édition, suppression, favoris
- [x] **Download** : Original et processed individuels

### 🚀 Améliorations Futures (Optionnelles)
- [ ] **Téléchargement ZIP** : Multiple sélection
- [ ] **Partage public** : URLs publiques pour images
- [ ] **API Rate Limiting** : Protection avancée
- [ ] **Compression automatique** : Optimisation avant stockage

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