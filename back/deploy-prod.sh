#!/bin/bash
# deploy-prod.sh - Script de déploiement complet sur VPS
# PostgreSQL + FastAPI ensemble

# Configuration VPS
VPS_HOST="69.62.105.107"
VPS_USER="root"
PROJECT_PATH="/root/bg-remover-api"

echo "🚀 === DÉPLOIEMENT COMPLET SUR VPS ==="

# Vérifications préalables
if [ ! -f ".env.prod" ]; then
    echo "❌ Erreur: Fichier .env.prod manquant"
    echo "📋 Copiez .env.prod.example vers .env.prod et configurez-le"
    exit 1
fi

echo "📦 1. Upload du code vers VPS..."
rsync -av --delete \
    --exclude='venv/' \
    --exclude='__pycache__/' \
    --exclude='*.pyc' \
    --exclude='.git/' \
    --exclude='*.log' \
    --exclude='node_modules/' \
    --exclude='.env.prod' \
    . $VPS_USER@$VPS_HOST:$PROJECT_PATH/

# Upload du fichier .env.prod séparément
echo "🔐 2. Upload de la configuration..."
scp .env.prod $VPS_USER@$VPS_HOST:$PROJECT_PATH/.env.prod

echo "🐳 3. Déploiement sur VPS..."
ssh $VPS_USER@$VPS_HOST << 'EOF'
cd /root/bg-remover-api

echo "🔄 Arrêt des services existants..."
docker compose -f docker-compose.prod.yml down || true

echo "🏗️  Build des images..."
docker compose -f docker-compose.prod.yml build --no-cache

echo "🚀 Démarrage des services..."
docker compose -f docker-compose.prod.yml up -d

echo "⏱️  Attente du démarrage..."
sleep 10

echo "📊 État des services:"
docker compose -f docker-compose.prod.yml ps

echo "📝 Logs PostgreSQL:"
docker compose -f docker-compose.prod.yml logs --tail=5 postgres

echo "📝 Logs FastAPI:"
docker compose -f docker-compose.prod.yml logs --tail=5 fastapi

echo "🏥 Test de santé:"
curl -s http://localhost:8001/health || echo "❌ API non accessible"
EOF

echo "=== 🎉 DÉPLOIEMENT TERMINÉ ==="
echo "🌐 API URL: http://$VPS_HOST:8001"
echo "🗄️  PostgreSQL: $VPS_HOST:5432"
echo ""
echo "🧪 Tests à faire:"
echo "curl http://$VPS_HOST:8001/health"
echo "curl http://$VPS_HOST:8001/docs"