# Commandes PostgreSQL

## Commandes Docker Compose

### Gestion du service
```bash
# Démarrer PostgreSQL
sudo docker compose -f docker-compose.db.yml up -d

# Arrêter PostgreSQL
sudo docker compose -f docker-compose.db.yml down

# Reconstruire l'image
sudo docker compose -f docker-compose.db.yml up -d --build

# Voir les logs
sudo docker compose -f docker-compose.db.yml logs postgres

# Logs en temps réel
sudo docker compose -f docker-compose.db.yml logs -f postgres

# Statut des services
sudo docker compose -f docker-compose.db.yml ps
```

### Gestion des volumes
```bash
# Supprimer les données (ATTENTION!)
sudo docker compose -f docker-compose.db.yml down -v

# Voir les volumes
docker volume ls

# Inspecter un volume
docker volume inspect background-remover_postgres_data
```

## Connexion à PostgreSQL

### Via Docker
```bash
# Connexion interactive
sudo docker exec -it bg-remover-postgres psql -U bg_user -d background_remover

# Exécuter une commande SQL directe
sudo docker exec -it bg-remover-postgres psql -U bg_user -d background_remover -c "SELECT version();"
```

### Via psql local (si installé)
```bash
psql -h localhost -U bg_user -d background_remover
```

## Commandes psql (dans PostgreSQL)

### Navigation
```sql
-- Lister les bases de données
\l

-- Se connecter à une base
\c background_remover

-- Lister les tables
\dt

-- Lister les vues
\dv

-- Lister les index
\di

-- Lister les utilisateurs/rôles
\du

-- Lister les extensions
\dx

-- Voir le schéma d'une table
\d table_name

-- Aide sur les commandes psql
\?

-- Aide sur les commandes SQL
\h

-- Quitter
\q
```

### Requêtes utiles
```sql
-- Version de PostgreSQL
SELECT version();

-- Bases de données
SELECT datname FROM pg_database;

-- Tables dans la base courante
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Taille de la base de données
SELECT pg_size_pretty(pg_database_size('background_remover'));

-- Utilisateurs connectés
SELECT * FROM pg_stat_activity;

-- Extensions installées
SELECT * FROM pg_extension;
```

## Backup et Restore

### Backup
```bash
# Dump complet
sudo docker exec bg-remover-postgres pg_dump -U bg_user background_remover > backup.sql

# Dump avec compression
sudo docker exec bg-remover-postgres pg_dump -U bg_user -Fc background_remover > backup.dump

# Dump des données seulement
sudo docker exec bg-remover-postgres pg_dump -U bg_user --data-only background_remover > data_only.sql
```

### Restore
```bash
# Restore depuis un fichier SQL
sudo docker exec -i bg-remover-postgres psql -U bg_user -d background_remover < backup.sql

# Restore depuis un dump compressé
sudo docker exec bg-remover-postgres pg_restore -U bg_user -d background_remover backup.dump
```

## Variables d'environnement

```bash
# Dans votre .env.local Next.js
DATABASE_URL="postgresql://bg_user:bg_password_2024@localhost:5432/background_remover"

# Pour Prisma
DATABASE_URL="postgresql://bg_user:bg_password_2024@localhost:5432/background_remover"
```