# PostgreSQL Database Setup

## Démarrage rapide

```bash
# Démarrer PostgreSQL
docker-compose -f docker-compose.db.yml up -d

# Vérifier le statut
docker-compose -f docker-compose.db.yml ps

# Logs
docker-compose -f docker-compose.db.yml logs postgres
```

## Configuration

- **Database**: `background_remover`
- **User**: `bg_user`
- **Password**: `bg_password_2024`
- **Port**: `5432`

## Connexion

```bash
# Via Docker
docker exec -it bg-remover-postgres psql -U bg_user -d background_remover

# Via psql local
psql -h localhost -U bg_user -d background_remover
```

## String de connexion

```
DATABASE_URL="postgresql://bg_user:bg_password_2024@localhost:5432/background_remover"
```

## Commandes utiles

```bash
# Arrêter
docker-compose -f docker-compose.db.yml down

# Supprimer données (ATTENTION!)
docker-compose -f docker-compose.db.yml down -v
```