# Dépannage PostgreSQL

## Problèmes courants

### 1. Docker Compose non trouvé

**Erreur :**
```
sudo: docker-compose: command not found
```

**Solution :**
```bash
# Utiliser la nouvelle syntaxe (sans tiret)
sudo docker compose -f docker-compose.db.yml up -d

# Au lieu de
sudo docker-compose -f docker-compose.db.yml up -d
```

### 2. Permission denied Docker

**Erreur :**
```
permission denied while trying to connect to the Docker daemon socket
```

**Solution :**
```bash
# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER

# Recharger les groupes
newgrp docker

# Ou redémarrer la session
logout && login
```

### 3. Dockerfile build failed

**Erreur :**
```
/bin/sh: can't create /usr/share/postgresql/postgresql.conf.sample: nonexistent directory
```

**Solution :**
Le chemin n'existe pas dans l'image Alpine. Utiliser les variables d'environnement à la place (déjà corrigé).

### 4. Port déjà utilisé

**Erreur :**
```
Error starting userland proxy: listen tcp4 0.0.0.0:5432: bind: address already in use
```

**Solution :**
```bash
# Voir qui utilise le port
sudo lsof -i :5432

# Tuer le processus PostgreSQL local
sudo systemctl stop postgresql

# Ou changer le port dans docker-compose.db.yml
ports:
  - "5433:5432"  # Utiliser le port 5433 localement
```

### 5. Connexion refusée

**Erreur :**
```
psql: error: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
```

**Solutions :**
```bash
# 1. Vérifier que le conteneur est démarré
sudo docker compose -f docker-compose.db.yml ps

# 2. Voir les logs
sudo docker compose -f docker-compose.db.yml logs postgres

# 3. Redémarrer le service
sudo docker compose -f docker-compose.db.yml restart postgres
```

### 6. Conteneur ne démarre pas

**Diagnostic :**
```bash
# Logs détaillés
sudo docker compose -f docker-compose.db.yml logs postgres

# Statut du conteneur
docker ps -a | grep postgres

# Inspecter le conteneur
docker inspect bg-remover-postgres
```

### 7. Authentification échoue

**Erreur :**
```
psql: error: connection to server failed: FATAL: password authentication failed for user "bg_user"
```

**Solution :**
```bash
# Vérifier les variables d'environnement
sudo docker exec bg-remover-postgres env | grep POSTGRES

# Recréer complètement
sudo docker compose -f docker-compose.db.yml down -v
sudo docker compose -f docker-compose.db.yml up -d --build
```

### 8. Données perdues après redémarrage

**Cause :** Volume non monté correctement

**Solution :**
```bash
# Vérifier les volumes
docker volume ls | grep postgres

# Dans docker-compose.db.yml, s'assurer que :
volumes:
  - postgres_data:/var/lib/postgresql/data
```

## Commandes de diagnostic

### État général
```bash
# Santé du conteneur
sudo docker compose -f docker-compose.db.yml ps

# Logs récents
sudo docker compose -f docker-compose.db.yml logs --tail=50 postgres

# Ressources utilisées
docker stats bg-remover-postgres
```

### Dans PostgreSQL
```sql
-- Connexions actives
SELECT * FROM pg_stat_activity;

-- Taille des bases
SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database;

-- Configuration actuelle
SHOW all;

-- Version
SELECT version();
```

### Réseau
```bash
# Vérifier la connectivité réseau
sudo docker network ls | grep bg

# Inspecter le réseau
sudo docker network inspect background-remover_bg-network
```

## Nettoyage complet

⚠️ **ATTENTION : Ceci supprime toutes les données !**

```bash
# Arrêter et supprimer tout
sudo docker compose -f docker-compose.db.yml down -v

# Supprimer les images
docker rmi background-remover-postgres postgres:16-alpine

# Nettoyer le système Docker
docker system prune -a

# Redémarrer proprement
sudo docker compose -f docker-compose.db.yml up -d --build
```

## Logs utiles

### Structure des logs
```bash
# Logs PostgreSQL dans le conteneur
sudo docker exec bg-remover-postgres ls -la /var/log/

# Logs via Docker
sudo docker compose -f docker-compose.db.yml logs postgres | head -50
```

### Activer les logs détaillés
Ajouter dans `docker-compose.db.yml` :
```yaml
environment:
  POSTGRES_INITDB_ARGS: "--auth-host=scram-sha-256 --auth-local=trust"
  POSTGRES_HOST_AUTH_METHOD: trust
  POSTGRES_LOG_STATEMENT: all
  POSTGRES_LOG_MIN_MESSAGES: info
```