# Background Remover

A complete web application to remove image backgrounds in 1 click using artificial intelligence.

<img width="2088" height="1307" alt="image" src="https://github.com/user-attachments/assets/c2b7e752-6f4b-41c7-b98d-a75a2702ef89" />



## Architecture

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Python with FastAPI and rembg
- **Deployment**: Azure Container Apps
- **Analytics**: Google Analytics and Vercel Analytics

## Features

- **Background Removal**: Upload an image and get it back with the background removed
- **Modern UI**: Intuitive user interface with Next.js
- **FastAPI**: Modern, fast web framework for building APIs
- **Docker Support**: Ready for containerization and deployment
- **Azure Container Apps**: Deployment scripts included
- **Analytics Integration**: Google Analytics and Vercel Analytics integrated

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
├── front/                      # Next.js Application
│   ├── app/                   # Next.js pages and components
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utilities and configuration
│   └── package.json           # Frontend dependencies
├── back/                      # Python FastAPI API
│   ├── main.py                # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Docker configuration
│   ├── deploy.sh              # Deployment script
│   └── update.sh              # Update script
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
- **Vercel Analytics**: Integrated analytics

### Backend

- **FastAPI**: Web framework
- **rembg**: Background removal library
- **Python**: Programming language

### Deployment & Infrastructure

- **Docker**: Containerization
- **Azure Container Apps**: Cloud deployment platform
- **Azure Container Registry**: Docker image storage

### Analytics

- **Google Analytics**: User tracking
- **Vercel Analytics**: Performance monitoring

## Roadmap - Upcoming Features

### 🔐 Authentication

- [ ] User authentication system
- [ ] Account and profile management
- [ ] OAuth login (Google, GitHub)

### 💾 Image Storage

- [ ] Upload images to Azure Blob Storage
- [ ] Automatic backup of processed images
- [ ] File metadata management

### 📊 User Management

- [ ] Processing limits per user => redirect to contact form for more features
- [ ] Quota system (e.g., 10 images/day for free users)
- [ ] Usage tracking per user

### 🖼️ Personal Gallery

- [ ] Interface to view generated images
- [ ] Processing history
- [ ] Ability to re-download images
- [ ] Organization by folders/tags

## License

This project is for educational and portfolio purposes.
