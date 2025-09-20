# Azure Blob Storage Setup Guide

## 🎯 Configuration Steps for Production

### Step 1: Create Azure Storage Account

#### Via Azure Portal:
1. **Login to Azure Portal**: https://portal.azure.com
2. **Create Storage Account**:
   - Go to "Storage accounts" → "Create"
   - **Subscription**: Choose your subscription
   - **Resource Group**: Create new or use existing
   - **Storage Account Name**: `backgroundremover` (must be globally unique)
   - **Region**: Choose closest to your users (e.g., West Europe, East US)
   - **Performance**: Standard
   - **Redundancy**: LRS (Locally Redundant Storage) for cost-effectiveness

3. **Configure Access**:
   - **Security**: Enable "Secure transfer required"
   - **Public Access**: Disable (we'll use SAS tokens)
   - **Default to Azure AD**: Recommended

#### Via Azure CLI (Alternative):
```bash
# Login to Azure
az login

# Create resource group
az group create --name bg-remover-rg --location westeurope

# Create storage account
az storage account create \
  --name backgroundremover \
  --resource-group bg-remover-rg \
  --location westeurope \
  --sku Standard_LRS \
  --kind StorageV2 \
  --https-only true
```

### Step 2: Get Connection String

#### Via Azure Portal:
1. Navigate to your storage account
2. Go to "Security + networking" → "Access keys"
3. Copy the **Connection string** from key1 or key2

#### Via Azure CLI:
```bash
az storage account show-connection-string \
  --name backgroundremover \
  --resource-group bg-remover-rg \
  --output tsv
```

### Step 3: Update Environment Variables

Update your `.env.local` file:

```env
# Azure Blob Storage - PRODUCTION
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=backgroundremover;AccountKey=ACTUAL_KEY_HERE;EndpointSuffix=core.windows.net
```

⚠️ **Security Note**: Never commit real connection strings to git!

## 📋 Complete Task Checklist

### ✅ Infrastructure Setup

- [ ] **Create Azure Storage Account**
  - [ ] Choose appropriate region for performance
  - [ ] Set up proper resource group
  - [ ] Configure security settings
  - [ ] Note down account name and keys

- [ ] **Configure Environment Variables**
  - [ ] Update `.env.local` with real connection string
  - [ ] Update production environment (Vercel/Netlify) with env vars
  - [ ] Verify connection string format is correct

- [ ] **Test Azure Connection**
  - [ ] Run a simple connectivity test
  - [ ] Verify container creation works
  - [ ] Test file upload/download operations

### ✅ Application Configuration

- [ ] **Update ESLint Configuration** (if needed)
  - [ ] Add any Azure-specific linting rules
  - [ ] Configure TypeScript rules for Azure SDK

- [ ] **Container Setup**
  - [ ] Verify automatic container creation works
  - [ ] Set proper container permissions
  - [ ] Test blob naming conventions

- [ ] **Error Handling**
  - [ ] Test Azure unavailability scenarios
  - [ ] Verify graceful degradation
  - [ ] Add proper logging for Azure operations

### ✅ Testing & Validation

- [ ] **Development Testing**
  - [ ] Upload test image as authenticated user
  - [ ] Verify image appears in gallery
  - [ ] Test image editing (title, tags, favorite)
  - [ ] Test image deletion
  - [ ] Verify Azure cleanup on deletion

- [ ] **Authentication Flow Testing**
  - [ ] Test anonymous user experience (no gallery)
  - [ ] Test authenticated user gets gallery access
  - [ ] Verify user isolation (users can't see each other's images)

- [ ] **Gallery Functionality Testing**
  - [ ] Test pagination with multiple images
  - [ ] Test search and filtering
  - [ ] Test responsive design on mobile
  - [ ] Test image modal functionality
  - [ ] Test download functionality

- [ ] **Performance Testing**
  - [ ] Test with large images (near 10MB limit)
  - [ ] Verify thumbnail generation performance
  - [ ] Test gallery loading with many images
  - [ ] Monitor Azure bandwidth usage

### ✅ Production Deployment

- [ ] **Security Verification**
  - [ ] Verify SAS URLs expire properly
  - [ ] Test that users can't access other users' images
  - [ ] Verify Azure access keys are not exposed

- [ ] **Monitoring Setup**
  - [ ] Set up Azure Storage monitoring
  - [ ] Configure alerts for quota/bandwidth limits
  - [ ] Monitor error rates and performance

- [ ] **Backup Strategy**
  - [ ] Document Azure backup policies
  - [ ] Test database backup (includes image metadata)
  - [ ] Verify disaster recovery procedures

## 🔧 Quick Test Commands

Once Azure is configured, test the integration:

```bash
# Test the application build
npm run build

# Run development server
npm run dev

# Test with a real image upload (authenticated)
# 1. Sign in with Google
# 2. Upload an image
# 3. Check Azure Storage Account for created containers
# 4. Verify gallery shows the image
```

## 🚨 Troubleshooting Common Issues

### Issue: "Azure Storage connection string not found"
**Solution**: Verify environment variable name and restart Next.js dev server

### Issue: "Container creation failed"
**Solution**: Check Azure account permissions and network connectivity

### Issue: "SAS URL generation failed"
**Solution**: Verify storage account key permissions and container exists

### Issue: "Images not appearing in gallery"
**Solution**: Check user authentication and database records

## 📊 Monitoring & Maintenance

### Azure Portal Monitoring:
1. **Storage Account Metrics**: Monitor requests, bandwidth, errors
2. **Cost Management**: Track storage and bandwidth costs
3. **Activity Log**: Monitor who accessed what and when

### Application Monitoring:
1. **Database Usage**: Monitor UserImage table growth
2. **Error Logs**: Watch for Azure SDK errors
3. **Performance**: Monitor image processing times

## 💰 Cost Optimization

### Storage Costs:
- **Hot tier**: For frequently accessed images (thumbnails)
- **Cool tier**: For original images (less frequent access)
- **Archive tier**: For long-term storage (if implemented)

### Bandwidth Costs:
- Use Azure CDN for thumbnails if high traffic
- Monitor egress bandwidth usage
- Consider image compression optimization

## 🔐 Security Best Practices

1. **Rotate Access Keys**: Regularly rotate Azure storage keys
2. **Use SAS Tokens**: Never expose raw blob URLs
3. **Monitor Access**: Set up alerts for unusual access patterns
4. **Network Security**: Consider private endpoints for high-security needs

---

## Next Immediate Actions:

1. **Create Azure Storage Account** (15 minutes)
2. **Update environment variables** (5 minutes)
3. **Test image upload flow** (10 minutes)
4. **Verify gallery functionality** (15 minutes)

Total estimated setup time: **45 minutes**

---

🤖 **Generated with [Claude Code](https://claude.ai/code)**