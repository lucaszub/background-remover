#!/bin/bash

# Deployment script for background remover API to Azure Container Apps
# Copy this file to deploy.sh and replace the placeholder values with your own

# Variables - Replace with your values
RESOURCE_GROUP="YOUR_RESOURCE_GROUP"           # e.g., "rg-your-project"
LOCATION="YOUR_LOCATION"                       # e.g., "westeurope", "eastus"
CONTAINER_APP_ENV="YOUR_CONTAINER_APP_ENV"     # e.g., "env-your-project"
CONTAINER_APP_NAME="YOUR_CONTAINER_APP_NAME"   # e.g., "your-api-name"
ACR_NAME="YOUR_ACR_NAME"                      # e.g., "acryourproject" (must be globally unique)

echo "=== Deploying to Azure Container Apps ==="

# 1. Create resource group
echo "Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# 2. Create Azure Container Registry
echo "Creating Azure Container Registry..."
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic --admin-enabled true

# 3. Build and push Docker image
echo "Building and pushing Docker image..."
az acr build --registry $ACR_NAME --image background-remover:latest .

# 4. Create Container Apps environment
echo "Creating Container Apps environment..."
az containerapp env create \
  --name $CONTAINER_APP_ENV \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# 5. Deploy the application
echo "Deploying application..."
az containerapp create \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENV \
  --image $ACR_NAME.azurecr.io/background-remover:latest \
  --target-port 8000 \
  --ingress 'external' \
  --registry-server $ACR_NAME.azurecr.io \
  --cpu 1.0 \
  --memory 2.0Gi \
  --min-replicas 0 \
  --max-replicas 3

echo "=== Deployment completed ==="
echo "Your API is now deployed on Azure Container Apps!"

# Display application URL
az containerapp show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn