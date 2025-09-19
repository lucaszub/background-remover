# Plan d'évolution : Historique des images par utilisateur

## 🎯 Objectif
Implémenter un système complet de galerie personnelle avec Azure Blob Storage pour permettre aux utilisateurs de :
- Voir l'historique de leurs images traitées
- Télécharger leurs anciennes créations
- Organiser et gérer leur galerie

## 📊 Évolutions du modèle de données

### 1. Nouveau modèle `UserImage`
```prisma
model UserImage {
  id              String   @id @default(cuid())
  userId          String
  title           String?  @default("Image sans titre")

  // URLs Azure Blob Storage
  originalUrl     String   // Container: originals/{userId}/{id}_original.{ext}
  processedUrl    String   // Container: processed/{userId}/{id}_processed.png
  thumbnailUrl    String?  // Container: thumbnails/{userId}/{id}_thumb.webp

  // Métadonnées fichier
  originalName    String
  fileSize        Int      // En bytes
  fileType        String   // image/jpeg, image/png, etc.
  dimensions      Json?    // {width: number, height: number}

  // Métadonnées processing
  processingTime  Int?     // En millisecondes
  quality         String?  // 'excellent', 'good', 'fair'

  // Organisation
  tags            String[] @default([])
  isPublic        Boolean  @default(false)
  isFavorite      Boolean  @default(false)

  // Relations et index
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
  @@index([userId, isFavorite])
  @@index([tags])
  @@map("user_images")
}
```

### 2. Mise à jour du modèle `User`
```prisma
model User {
  // ... champs existants
  images          UserImage[]  // Nouvelle relation
  storageUsed     BigInt       @default(0) // Stockage utilisé en bytes
}
```

### 3. Nouveau modèle `StorageQuota` (optionnel)
```prisma
model StorageQuota {
  id              String   @id @default(cuid())
  userId          String   @unique
  storageLimit    BigInt   @default(1073741824) // 1GB par défaut
  storageUsed     BigInt   @default(0)
  imageLimit      Int      @default(100)
  imageCount      Int      @default(0)

  user            User     @relation(fields: [userId], references: [id])
  @@map("storage_quotas")
}
```

## 🏗️ Architecture Azure Blob Storage

### Structure des containers
```
background-remover-storage/
├── originals/
│   └── {userId}/
│       └── {imageId}_original.{ext}
├── processed/
│   └── {userId}/
│       └── {imageId}_processed.png
└── thumbnails/
    └── {userId}/
        └── {imageId}_thumb.webp
```

### Configuration recommandée
- **Niveau d'accès** : Private (accès via SAS tokens uniquement)
- **Redondance** : LRS (Locally Redundant Storage) pour commencer
- **Lifecycle policies** : Déplacer vers Cool après 30 jours
- **CDN** : Azure CDN pour optimiser les performances

## 📋 Étapes d'implémentation

### Phase 1 : Infrastructure et modèles ✅ Priorité haute
1. **Setup Azure Blob Storage**
   - Créer le compte de stockage Azure
   - Configurer les containers
   - Générer les clés d'accès

2. **Évolution base de données**
   ```bash
   # Créer la migration Prisma
   npx prisma migrate dev --name add_user_images
   ```

3. **Variables d'environnement**
   ```env
   # Azure Blob Storage
   AZURE_STORAGE_ACCOUNT_NAME=backgroundremover
   AZURE_STORAGE_ACCOUNT_KEY=your_key_here
   AZURE_STORAGE_CONNECTION_STRING=your_connection_string
   ```

### Phase 2 : Utilitaires de stockage
4. **Créer `/lib/azure-storage.ts`**
   - Fonctions upload/download
   - Génération SAS tokens
   - Gestion thumbnails

5. **Créer `/lib/image-service.ts`**
   - CRUD operations pour UserImage
   - Calcul du stockage utilisé
   - Validation des quotas

### Phase 3 : APIs
6. **Modifier `/api/remove-background/route.ts`**
   - Sauvegarder l'original sur Azure
   - Envoyer l'URL à FastAPI
   - Sauvegarder le résultat et métadonnées

7. **Créer `/api/gallery/route.ts`**
   - GET : Lister les images de l'utilisateur
   - DELETE : Supprimer une image

8. **Créer `/api/images/[id]/route.ts`**
   - GET : Détails d'une image
   - PUT : Mise à jour (titre, tags, favorite)
   - DELETE : Suppression

### Phase 4 : Interface utilisateur
9. **Créer `/components/Gallery.tsx`**
   - Grid layout avec lazy loading
   - Filtres par date, tags, favoris
   - Comparaison avant/après

10. **Créer `/app/gallery/page.tsx`**
    - Page galerie principale
    - Pagination et recherche
    - Actions bulk (suppression multiple)

11. **Modifier la page principale**
    - Redirection vers galerie après traitement
    - Lien vers galerie dans le header

## 🔄 Workflow utilisateur mis à jour

### Nouveau parcours
1. **Upload image** → Next.js API
2. **Sauvegarde original** → Azure Blob (avec SAS token)
3. **Traitement** → FastAPI reçoit l'URL Azure
4. **Sauvegarde résultat** → Azure Blob + métadonnées PostgreSQL
5. **Redirection** → Galerie avec nouvelle image
6. **Navigation** → Utilisateur peut voir son historique

### Fonctionnalités galerie
- **Vue grille** avec thumbnails optimisés
- **Vue détaillée** avec comparaison avant/après
- **Téléchargement** individuel ou batch (ZIP)
- **Organisation** : tags, favoris, tri par date
- **Partage** : liens publics temporaires (optionnel)

## 💡 Fonctionnalités avancées (Phase 5+)

### Analytics utilisateur
- Statistiques d'usage
- Types d'images les plus traités
- Évolution de la qualité de traitement

### Optimisations
- Compression intelligente selon l'usage
- Pre-génération de thumbnails
- Cache CDN optimisé

### Monétisation
- Quotas de stockage par plan
- Export haute qualité pour premium
- API access pour développeurs

## 🚀 Priorisation recommandée

1. **Semaine 1** : Phase 1 + 2 (Infrastructure + Utilitaires)
2. **Semaine 2** : Phase 3 (APIs de base)
3. **Semaine 3** : Phase 4 (Interface galerie)
4. **Semaine 4** : Tests, optimisations, déploiement

## 📝 Notes techniques

### Sécurité
- SAS tokens avec expiration courte (1h)
- Validation MIME types côté serveur
- Rate limiting sur les uploads
- Scan antivirus pour fichiers uploadés (optionnel)

### Performance
- Thumbnails générés à la volée avec cache
- Pagination server-side pour grandes galeries
- Lazy loading des images
- WebP pour thumbnails, PNG/JPEG pour originaux

### Monitoring
- Métriques Azure Storage
- Logs d'accès et erreurs
- Alertes sur quotas atteints
- Analytics d'usage par utilisateur