# Installation et Configuration PostgreSQL

## Prérequis

### 1. Installation Docker
```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker

# Ou redémarrer la session
logout
# Se reconnecter
```

### 2. Vérification Docker
```bash
docker --version
docker compose version
```

## Configuration des fichiers

### 1. Dockerfile.postgres
```dockerfile
FROM postgres:16-alpine

# Variables d'environnement pour PostgreSQL
ENV POSTGRES_DB=background_remover
ENV POSTGRES_USER=bg_user
ENV POSTGRES_PASSWORD=bg_password_2024

# Exposer le port PostgreSQL
EXPOSE 5432

# Volume pour persister les données
VOLUME ["/var/lib/postgresql/data"]

# Copier les scripts d'initialisation si nécessaire
COPY ./database/init/ /docker-entrypoint-initdb.d/

# Configuration PostgreSQL optimisée sera faite via variables d'environnement
ENV POSTGRES_INITDB_ARGS="--auth-host=scram-sha-256 --auth-local=trust"
```

### 2. docker-compose.db.yml
```yaml
services:
  postgres:
    build:
      context: .
      dockerfile: Dockerfile.postgres
    container_name: bg-remover-postgres
    environment:
      POSTGRES_DB: background_remover
      POSTGRES_USER: bg_user
      POSTGRES_PASSWORD: bg_password_2024
      POSTGRES_HOST_AUTH_METHOD: trust
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bg_user -d background_remover"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - bg-network

volumes:
  postgres_data:
    driver: local

networks:
  bg-network:
    driver: bridge
```

### 3. Script d'initialisation (database/init/01-init.sql)
```sql
-- Initialisation de la base de données Background Remover
-- Ce script sera exécuté automatiquement au premier démarrage

-- Extensions utiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Configuration de base
SET timezone = 'UTC';

-- Log du succès de l'initialisation
DO $$
BEGIN
    RAISE NOTICE 'Database background_remover initialized successfully';
END $$;
```

## Démarrage

### 1. Première installation
```bash
cd /home/lucas-zubiarrain/background-remover/background-remover

# Démarrer PostgreSQL
sudo docker compose -f docker-compose.db.yml up -d --build
```

### 2. Vérification
```bash
# Statut des conteneurs
sudo docker compose -f docker-compose.db.yml ps

# Logs
sudo docker compose -f docker-compose.db.yml logs postgres

# Test de connexion
sudo docker exec -it bg-remover-postgres psql -U bg_user -d background_remover
```

## Configuration .gitignore

Les éléments suivants ont été ajoutés au .gitignore :

```
# Database
database/data/
postgres_data/
*.sql.backup

# Environment files
.env
.env.local
.env.production
.env.staging
```

## Prochaines étapes

1. **Prisma** : Configuration de l'ORM
2. **NextAuth** : Adapter pour PostgreSQL
3. **Migrations** : Schéma de base de données
4. **Seeders** : Données initiales