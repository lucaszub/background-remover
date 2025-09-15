# 🚀 DEPLOYMENT TASKS - VPS Database Setup

## Architecture cible
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Next.js       │    │    FastAPI       │    │   PostgreSQL        │
│   (Vercel)      │────│    (VPS)         │────│   (VPS)             │
│   Port: 443     │    │    Port: 8001    │    │   Port: 5432        │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                                                │ + Azure Blob Storage │
                                                │ (Images - plus tard) │
                                                └─────────────────────┘
```

## 📋 TASKS À FAIRE

### 1. 🗄️ Setup PostgreSQL sur VPS

#### A. Créer docker-compose pour production VPS
```yaml
# Fichier: docker-compose.prod.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: bg-remover-postgres-prod
    environment:
      POSTGRES_DB: background_remover_prod
      POSTGRES_USER: bg_user_prod
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_HOST_AUTH_METHOD: scram-sha-256
    ports:
      - "5432:5432"
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    restart: unless-stopped
    networks:
      - bg-network-prod

  fastapi:
    build:
      context: ./back
      dockerfile: Dockerfile
    container_name: bg-remover-api-prod
    ports:
      - "8001:8000"
    environment:
      - DATABASE_URL=postgresql://bg_user_prod:${POSTGRES_PASSWORD}@postgres:5432/background_remover_prod
    depends_on:
      - postgres
    restart: unless-stopped
    networks:
      - bg-network-prod

volumes:
  postgres_prod_data:
    driver: local

networks:
  bg-network-prod:
    driver: bridge
```

#### B. Variables d'environnement VPS
```bash
# Fichier: .env.prod (à créer sur VPS)
POSTGRES_PASSWORD=bg_super_secure_password_2024
DATABASE_URL="postgresql://bg_user_prod:bg_super_secure_password_2024@IP_VPS:5432/background_remover_prod"
```

#### C. Script de déploiement DB
```bash
# Fichier: deploy-db-vps.sh
#!/bin/bash
VPS_HOST="69.62.105.107"
VPS_USER="root"
PROJECT_PATH="/root/bg-remover"

# Upload fichiers DB
rsync -av --delete docker-compose.prod.yml $VPS_USER@$VPS_HOST:$PROJECT_PATH/
rsync -av --delete database/ $VPS_USER@$VPS_HOST:$PROJECT_PATH/database/
rsync -av --delete Dockerfile.postgres $VPS_USER@$VPS_HOST:$PROJECT_PATH/

# Deploy sur VPS
ssh $VPS_USER@$VPS_HOST << 'EOF'
cd /root/bg-remover
docker compose -f docker-compose.prod.yml up -d postgres
docker compose -f docker-compose.prod.yml logs postgres
EOF
```

### 2. 🔧 Mise à jour FastAPI (sur VPS)

#### A. Modifier le Dockerfile FastAPI
```dockerfile
# back/Dockerfile - Ajouter support PostgreSQL
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .

# Ajouter psycopg2 pour PostgreSQL
RUN pip install --no-cache-dir -r requirements.txt psycopg2-binary

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### B. Mise à jour requirements.txt
```txt
# Ajouter à back/requirements.txt
psycopg2-binary==2.9.7
sqlalchemy==2.0.23
alembic==1.12.1  # Si tu veux des migrations FastAPI
```

#### C. Mise à jour script VPS
```bash
# Modifier update-vps.sh pour inclure la DB
VPS_HOST="69.62.105.107"
VPS_USER="root"
PROJECT_PATH="/root/bg-remover"

echo "📤 Upload code + DB config..."
rsync -av --delete \
  --exclude='venv/' \
  --exclude='front/' \
  . $VPS_USER@$VPS_HOST:$PROJECT_PATH/

ssh $VPS_USER@$VPS_HOST << 'EOF'
cd /root/bg-remover

# Start PostgreSQL + FastAPI
docker compose -f docker-compose.prod.yml up -d

# Check services
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail=10
EOF
```

### 3. 🌐 Configuration Vercel (Next.js)

#### A. Variables d'environnement Vercel
```bash
# Dans Vercel Dashboard > Settings > Environment Variables
DATABASE_URL="postgresql://bg_user_prod:PASSWORD@69.62.105.107:5432/background_remover_prod"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-super-secret-key-production"
FASTAPI_URL="http://69.62.105.107:8001"
FASTAPI_SECRET_KEY="bg-remover-secret-2024"

# OAuth Google (si différent pour prod)
GOOGLE_CLIENT_ID="your-prod-google-client-id"
GOOGLE_CLIENT_SECRET="your-prod-google-secret"
```

#### B. Prisma sur Vercel
```json
// package.json - Ajouter script de build
{
  "scripts": {
    "build": "prisma generate && prisma db push && next build",
    "postinstall": "prisma generate"
  }
}
```

### 4. 🔒 Sécurité VPS

#### A. Firewall
```bash
# Sur le VPS
ufw allow 22/tcp      # SSH
ufw allow 8001/tcp    # FastAPI
ufw allow 5432/tcp    # PostgreSQL (temporaire pour debug)
ufw enable
```

#### B. SSL/HTTPS
```bash
# Optionnel: Setup Nginx reverse proxy + Let's Encrypt
# Pour plus tard si tu veux un domaine
```

### 5. 🔄 Migration des données

#### A. Export données locales (optionnel)
```bash
# Si tu veux garder les données de test
npx tsx prisma/seed.ts  # Script déjà créé
```

#### B. Deploy schema Prisma sur VPS
```bash
# Depuis ton local, pointer vers VPS
DATABASE_URL="postgresql://bg_user_prod:PASSWORD@69.62.105.107:5432/background_remover_prod" npx prisma db push
```

## 📝 ORDRE D'EXÉCUTION

1. **Setup DB sur VPS** : Créer les fichiers docker-compose.prod.yml + .env.prod
2. **Deploy DB** : `./deploy-db-vps.sh`
3. **Update FastAPI** : Modifier requirements.txt + Dockerfile
4. **Deploy FastAPI** : `./update-vps.sh` (modifié)
5. **Setup Vercel** : Variables d'environnement + deploy
6. **Test complet** : Vercel → FastAPI → PostgreSQL

## 🧪 TESTS À FAIRE

```bash
# Test connexion DB depuis local
DATABASE_URL="postgresql://bg_user_prod:PASSWORD@69.62.105.107:5432/background_remover_prod" npx prisma studio

# Test FastAPI + DB
curl http://69.62.105.107:8001/health

# Test intégration complète
# App Vercel → Upload image → Vérifier quota en DB
```

## 📁 FICHIERS À CRÉER/MODIFIER

- [ ] `docker-compose.prod.yml` (nouveau)
- [ ] `.env.prod` (nouveau, sur VPS)
- [ ] `deploy-db-vps.sh` (nouveau)
- [ ] `back/requirements.txt` (modifier - ajouter PostgreSQL)
- [ ] `back/Dockerfile` (modifier si nécessaire)
- [ ] `update-vps.sh` (modifier pour DB)
- [ ] Variables Vercel (via dashboard)

## 🎯 RÉSULTAT ATTENDU

```
✅ PostgreSQL sur VPS (port 5432)
✅ FastAPI sur VPS (port 8001) connecté à PostgreSQL
✅ Next.js sur Vercel connecté aux deux
✅ Utilisateurs authentifiés + quotas trackés en DB VPS
✅ Images processées par FastAPI VPS
📋 Prêt pour Azure Blob Storage (étape suivante)
```