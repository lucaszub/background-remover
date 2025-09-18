#!/bin/bash
# redeploy-backend.sh - Redéploiement rapide du backend uniquement
# Pour un redéploiement complet (DB + API), utilisez deploy-prod.sh

# Configuration VPS
VPS_HOST="69.62.105.107"
VPS_USER="root"
PROJECT_PATH="/root/bg-remover-api"

echo "🔄 === REDÉPLOIEMENT BACKEND UNIQUEMENT ==="

# Vérifications préalables
if [ ! -f ".env.prod" ]; then
    echo "⚠️  Fichier .env.prod manquant - utilisation de la config existante sur le VPS"
fi

echo "📦 1. Upload du code backend vers VPS..."
rsync -av --delete \
    --exclude='venv/' \
    --exclude='__pycache__/' \
    --exclude='*.pyc' \
    --exclude='.git/' \
    --exclude='*.log' \
    --exclude='node_modules/' \
    --exclude='database/data/' \
    . $VPS_USER@$VPS_HOST:$PROJECT_PATH/

echo "🐳 3. Redéploiement du backend sur VPS..."
ssh $VPS_USER@$VPS_HOST << 'EOF'
cd /root/bg-remover-api

# Vérifier et installer Docker Compose si nécessaire
if ! command -v docker-compose &> /dev/null; then
    echo "📥 Installation de Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Charger les variables d'environnement
set -a
source .env.prod 2>/dev/null || echo "⚠️  Impossible de charger .env.prod"
set +a

echo "🔄 Arrêt des services existants..."
docker-compose -f docker-compose.prod.yml down || true

echo "🧹 Nettoyage des images existantes..."
docker system prune -f

echo "🏗️  Build/rebuild des images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🚀 Démarrage des services..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏱️  Attente du démarrage..."
sleep 10

echo "📊 État des services:"
docker-compose -f docker-compose.prod.yml ps

echo "📝 Logs FastAPI (dernières lignes):"
docker-compose -f docker-compose.prod.yml logs --tail=10 fastapi

echo "📝 Logs PostgreSQL:"
docker-compose -f docker-compose.prod.yml logs --tail=5 postgres

echo "🏥 Test de santé de l'API:"
sleep 3
if curl -s http://localhost:8001/health > /dev/null; then
    echo "✅ API opérationnelle"
else
    echo "❌ API non accessible - vérifiez les logs"
    echo "📝 Logs d'erreur:"
    docker-compose -f docker-compose.prod.yml logs --tail=20 fastapi
fi

echo "🗄️  État de la base de données:"
if docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready -U bg_user_prod -d background_remover_prod > /dev/null 2>&1; then
    echo "✅ PostgreSQL opérationnel"
else
    echo "⚠️  PostgreSQL pourrait avoir des problèmes"
    echo "📝 Logs PostgreSQL:"
    docker-compose -f docker-compose.prod.yml logs postgres
fi
EOF

echo ""
echo "=== 🎉 REDÉPLOIEMENT BACKEND TERMINÉ ==="
echo "🌐 API URL: http://$VPS_HOST:8001"
echo "📚 Documentation: http://$VPS_HOST:8001/docs"
echo ""
echo "🧪 Tests rapides:"
echo "curl http://$VPS_HOST:8001"
echo "curl http://$VPS_HOST:8001/docs"
echo ""
echo "📊 Pour surveiller les logs en temps réel:"
echo "ssh $VPS_USER@$VPS_HOST 'cd $PROJECT_PATH && docker compose -f docker-compose.prod.yml logs -f fastapi'"