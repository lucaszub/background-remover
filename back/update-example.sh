#!/bin/bash

# Update script for background remover API on Azure Container Apps
# Copy this file to update.sh and replace the placeholder values with your own

# Variables - should match your deploy.sh values
RESOURCE_GROUP="YOUR_RESOURCE_GROUP"           # e.g., "rg-your-project"
CONTAINER_APP_NAME="YOUR_CONTAINER_APP_NAME"   # e.g., "your-api-name"
ACR_NAME="YOUR_ACR_NAME"                      # e.g., "acryourproject"

echo "=== Updating background remover API ==="

# 1. Build and push new Docker image
echo "Building and pushing new Docker image..."
az acr build --registry $ACR_NAME --image background-remover:latest .

# 2. Update container app with new image
echo "Updating container app..."
az containerapp update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/background-remover:latest

echo "=== Update completed ==="
echo "Your API has been updated with the latest version!"

# Display application URL
az containerapp show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn