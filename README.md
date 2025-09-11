# Background Remover API

A simple FastAPI application that removes backgrounds from images using the `rembg` library.

## Features

- **Background Removal**: Upload an image and get it back with the background removed
- **FastAPI**: Modern, fast web framework for building APIs
- **Docker Support**: Ready for containerization and deployment
- **Azure Container Apps**: Deployment scripts included

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
├── back/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile             # Docker configuration
│   ├── deploy-example.sh      # Example deployment script
│   └── update-example.sh      # Example update script
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

- **FastAPI**: Web framework
- **rembg**: Background removal library
- **Docker**: Containerization
- **Azure Container Apps**: Cloud deployment platform
- **Azure Container Registry**: Docker image storage

## License

This project is for educational and portfolio purposes.
