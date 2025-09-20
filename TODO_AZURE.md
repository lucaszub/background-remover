# 🚀 Azure Blob Storage - TODO List

## ⚡ Actions Immédiates (45 min)

### 1. Créer le compte Azure Storage (15 min)
- [ ] Aller sur https://portal.azure.com
- [ ] Créer Storage Account nommé `backgroundremover`
- [ ] Région: West Europe (ou plus proche de tes utilisateurs)
- [ ] Type: Standard LRS
- [ ] Copier la connection string depuis "Access keys"

### 2. Configurer les variables d'environnement (5 min)
```bash
# Mettre à jour .env.local
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=backgroundremover;AccountKey=TON_VRAI_KEY;EndpointSuffix=core.windows.net
```

### 3. Tester l'upload d'image (10 min)
- [ ] `npm run dev`
- [ ] Se connecter avec Google Auth
- [ ] Upload une image de test
- [ ] Vérifier que l'image apparaît dans la galerie `/gallery`

### 4. Vérifier dans Azure Portal (15 min)
- [ ] Aller dans ton Storage Account
- [ ] Vérifier que les containers sont créés automatiquement:
  - `originals`
  - `processed`
  - `thumbnails`
- [ ] Voir que les fichiers sont bien uploadés

---

## 🔍 Tests Complets

### Fonctionnalités de base
- [ ] Upload image → apparaît dans galerie
- [ ] Cliquer sur image → modal s'ouvre
- [ ] Éditer titre/tags → sauvegardé
- [ ] Marquer comme favori → fonctionne
- [ ] Supprimer image → disparaît partout
- [ ] Download original/processed → fichiers corrects

### Navigation et filtres
- [ ] Search par titre → résultats corrects
- [ ] Filtre "Favorites only" → affiche que les favoris
- [ ] Pagination → fonctionne avec plusieurs images
- [ ] Mobile responsive → galerie utilisable sur phone

### Sécurité
- [ ] Utilisateur A ne voit pas les images de B
- [ ] URLs expirer après quelques heures
- [ ] Anonymous users → pas d'accès galerie

---

## 🚨 Points d'Attention

### Coûts Azure
- [ ] Vérifier les limites de coût dans Azure Portal
- [ ] Monitoring: Storage usage, bandwidth
- [ ] Alerts si dépassement budget

### Performance
- [ ] Tester avec images lourdes (8-10MB)
- [ ] Temps de génération thumbnails acceptable
- [ ] Galerie charge rapidement avec 20+ images

### Backup
- [ ] Base de données backup inclut metadata images
- [ ] Stratégie si Azure Storage inaccessible

---

## 🔧 Commandes Utiles

```bash
# Rebuild après changement env vars
npm run build

# Vérifier containers Azure
az storage container list --connection-string "VOTRE_CONNECTION_STRING"

# Monitor les logs
npm run dev
# puis upload une image et regarder console
```

---

## 📞 Support

**Si problème avec Azure:**
1. Vérifier connection string format
2. Restart Next.js dev server
3. Check Azure Portal pour errors/quotas
4. Logs dans browser console

**Si galerie ne fonctionne pas:**
1. User connecté ? (check session)
2. Base de données à jour ? (`npx prisma db push`)
3. Build successful ? (`npm run build`)

---

**Statut:** 🔴 En attente configuration Azure
**Estimation:** 45 minutes pour setup complet
**Priorité:** HIGH - Nécessaire pour galerie fonctionnelle