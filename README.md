# Background Remover

Une application web complète pour retirer le fond d'une image en 1 clic avec l'intelligence artificielle.

## Architecture

- **Frontend**: Next.js avec TypeScript et Tailwind CSS
- **Backend**: Python avec FastAPI et rembg
- **Déploiement**: Azure Container Apps
- **Analytics**: Google Analytics et Vercel Analytics

## Features

- **Background Removal**: Upload an image and get it back with the background removed
- **Modern UI**: Interface utilisateur intuitive avec Next.js
- **FastAPI**: Modern, fast web framework for building APIs
- **Docker Support**: Ready for containerization and deployment
- **Azure Container Apps**: Deployment scripts included
- **Analytics Integration**: Google Analytics et Vercel Analytics intégrées

## API Endpoints

### `GET /`

Health check endpoint that returns `{"Hello": "World"}`

### `POST /remove-bg`

Upload an image file and receive it back with the background removed.

**Request**: Multipart form data with an image file
**Response**: PNG image with transparent background

## Local Development

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd background-remover
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
cd back
pip install -r requirements.txt
```

4. Run the application:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## Docker

Build and run with Docker:

```bash
cd back
docker build -t background-remover .
docker run -p 8000:8000 background-remover
```

## Azure Deployment

This project includes scripts to deploy to Azure Container Apps.

### Prerequisites

- Azure CLI installed and configured:

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

- Azure subscription

### First Deployment

1. Copy the example deployment script:

```bash
cp back/deploy-example.sh back/deploy.sh
```

2. Edit `back/deploy.sh` and replace the placeholder values:

   - `YOUR_RESOURCE_GROUP`: Your Azure resource group name
   - `YOUR_LOCATION`: Azure region (e.g., "westeurope", "eastus")
   - `YOUR_CONTAINER_APP_ENV`: Container Apps environment name
   - `YOUR_CONTAINER_APP_NAME`: Your container app name
   - `YOUR_ACR_NAME`: Azure Container Registry name (must be globally unique)

3. Make the script executable and run it:

```bash
chmod +x back/deploy.sh
./back/deploy.sh
```

### Updates

For subsequent deployments after code changes:

1. Copy the example update script:

```bash
cp back/update-example.sh back/update.sh
```

2. Edit `back/update.sh` with the same values as your deploy script

3. Run the update:

```bash
chmod +x back/update.sh
./back/update.sh
```

## Project Structure

```
background-remover/
├── front/                      # Application Next.js
│   ├── app/                   # Pages et composants Next.js
│   ├── components/            # Composants React réutilisables
│   ├── lib/                   # Utilitaires et configuration
│   └── package.json           # Dépendances frontend
├── back/                      # API Python FastAPI
│   ├── main.py                # Application FastAPI
│   ├── requirements.txt       # Dépendances Python
│   ├── Dockerfile             # Configuration Docker
│   ├── deploy.sh              # Script de déploiement
│   └── update.sh              # Script de mise à jour
├── .gitignore
└── README.md
```

## Usage Example

Using curl to test the API:

```bash
curl -X POST "http://localhost:8000/remove-bg" \
     -H "accept: image/png" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@your-image.jpg" \
     --output result.png
```

## Technologies Used

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Vercel Analytics**: Analytics intégrées

### Backend

- **FastAPI**: Web framework
- **rembg**: Background removal library
- **Python**: Language de programmation

### Deployment & Infrastructure

- **Docker**: Containerization
- **Azure Container Apps**: Cloud deployment platform
- **Azure Container Registry**: Docker image storage

### Analytics

- **Google Analytics**: Tracking des utilisateurs
- **Vercel Analytics**: Performance monitoring

## Roadmap - Fonctionnalités à venir

### 🔐 Authentification

- [ ] Système d'authentification utilisateur
- [ ] Gestion des comptes et profils
- [ ] Connexion via OAuth (Google, GitHub)

### 💾 Stockage des images

- [ ] Upload des images sur Azure Blob Storage
- [ ] Sauvegarde automatique des images traitées
- [ ] Gestion des métadonnées des fichiers

### 📊 Gestion des utilisateurs

- [ ] Limite de traitement par utilisateur => renvoyer vers un formulaire contact pour plus de fonctionnalités.
- [ ] Système de quotas (ex: 10 images/jour pour les utilisateurs gratuits)
- [ ] Tracking de l'utilisation par utilisateur

### 🖼️ Galerie personnelle

- [ ] Interface pour visualiser les images générées
- [ ] Historique des traitements effectués
- [ ] Possibilité de télécharger à nouveau les images
- [ ] Organisation par dossiers/tags

## License

This project is for educational and portfolio purposes.
