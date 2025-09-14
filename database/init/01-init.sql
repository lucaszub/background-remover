-- Initialisation de la base de données Background Remover
-- Ce script sera exécuté automatiquement au premier démarrage

-- Extensions utiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Configuration de base
SET timezone = 'UTC';

-- Création d'un utilisateur pour l'application si nécessaire
-- (optionnel, déjà créé via POSTGRES_USER)

-- Log du succès de l'initialisation
DO $$
BEGIN
    RAISE NOTICE 'Database background_remover initialized successfully';
END $$;