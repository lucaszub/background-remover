# Documentation PostgreSQL - Background Remover

Cette documentation détaille la configuration complète de PostgreSQL pour le projet Background Remover.

## 📁 Structure des fichiers

```
background-remover/
├── Dockerfile.postgres          # Image PostgreSQL personnalisée
├── docker-compose.db.yml        # Configuration Docker Compose
├── database/
│   └── init/
│       └── 01-init.sql          # Script d'initialisation
└── docs/
    └── postgresql/              # Cette documentation
        ├── README.md
        ├── setup.md
        ├── commands.md
        └── troubleshooting.md
```

## 🚀 Guide rapide

1. **Installation** : [setup.md](./setup.md)
2. **Commandes utiles** : [commands.md](./commands.md)
3. **Dépannage** : [troubleshooting.md](./troubleshooting.md)

## ⚙️ Configuration

- **Base de données** : `background_remover`
- **Utilisateur** : `bg_user`
- **Port** : `5432`
- **Version** : PostgreSQL 16 (Alpine)

## 🔗 String de connexion

```
DATABASE_URL="postgresql://bg_user:bg_password_2024@localhost:5432/background_remover"
```