
# Guide de Déploiement Docker - KidneyVision

## 🐳 Vue d'Ensemble Docker

Docker permet de containeriser l'application complète pour un déploiement cohérent et reproductible. Cette approche garantit que l'application fonctionne de manière identique sur tous les environnements.

## 📁 Structure Docker

```
kidneyvision-full/
├── frontend/
│   ├── Dockerfile              # Image frontend React
│   ├── Dockerfile.dev          # Image développement
│   ├── docker-compose.yml      # Services frontend
│   └── nginx.conf              # Configuration Nginx
├── backend/
│   ├── Dockerfile              # Image backend FastAPI
│   └── docker-compose.yml      # Services backend
└── docker-compose.full.yml     # Orchestration complète
```

## 🚀 Déploiement Rapide

### 1. Lancement Système Complet

```bash
# Depuis la racine du projet
docker-compose -f docker-compose.full.yml up -d

# Vérifier les services
docker-compose -f docker-compose.full.yml ps

# Accéder aux applications
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Documentation API: http://localhost:8000/docs
```

### 2. Arrêt et Nettoyage

```bash
# Arrêter les services
docker-compose -f docker-compose.full.yml down

# Nettoyer les volumes (attention: supprime les données)
docker-compose -f docker-compose.full.yml down -v

# Nettoyage complet du système Docker
docker system prune -f
```

## 🔧 Configuration Docker Compose Complète

### docker-compose.full.yml

```yaml
version: '3.8'

services:
  # Backend FastAPI + Modèle IA
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./backend/data:/app/data:ro
      - ./backend/checkpoints:/app/checkpoints:ro
      - ./backend/results:/app/results
      - ./backend/uploads:/app/uploads
    environment:
      - MODEL_PATH=/app/checkpoints/kidney_model.h5
      - UPLOAD_DIR=/app/uploads
      - RESULTS_DIR=/app/results
      - CORS_ORIGINS=http://localhost:3000,https://*.lovable.app
    networks:
      - kidney-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend React + Nginx
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:8000
    depends_on:
      - backend
    networks:
      - kidney-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Base de données (optionnel)
  database:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=kidneyvision
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - kidney-network
    restart: unless-stopped

  # Redis pour le cache (optionnel)
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - kidney-network
    restart: unless-stopped

networks:
  kidney-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  model-data:
  upload-data:
```

## 🏗️ Images Docker Personnalisées

### Frontend Dockerfile

```dockerfile
# Multi-stage build pour optimiser la taille
FROM node:18-alpine as build

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
RUN npm ci --only=production

# Copier le code source et builder
COPY . .
RUN npm run build

# Stage de production avec Nginx
FROM nginx:alpine

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés
COPY --from=build /app/dist /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copier et installer les dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY . .

# Créer les dossiers nécessaires
RUN mkdir -p uploads results checkpoints data

# Exposer le port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Commande de démarrage
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🛠️ Développement avec Docker

### 1. Mode Développement

```bash
# Configuration pour le développement avec hot reload
docker-compose -f docker-compose.dev.yml up

# Accéder aux applications
# Frontend: http://localhost:8080
# Backend: http://localhost:8000
```

### 2. docker-compose.dev.yml

```yaml
version: '3.8'

services:
  frontend-dev:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "8080:8080"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:8000
    networks:
      - kidney-vision-dev

  backend-dev:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - ENV=development
      - RELOAD=true
    networks:
      - kidney-vision-dev

networks:
  kidney-vision-dev:
    driver: bridge
```

## 📊 Monitoring et Logs

### 1. Visualiser les Logs

```bash
# Logs de tous les services
docker-compose -f docker-compose.full.yml logs -f

# Logs d'un service spécifique
docker-compose -f docker-compose.full.yml logs -f backend
docker-compose -f docker-compose.full.yml logs -f frontend

# Logs avec timestamps
docker-compose -f docker-compose.full.yml logs -f -t

# Dernières 100 lignes de logs
docker-compose -f docker-compose.full.yml logs --tail=100
```

### 2. Monitoring des Containers

```bash
# Statut des containers
docker-compose -f docker-compose.full.yml ps

# Utilisation des ressources
docker stats

# Inspecter un container
docker inspect kidneyvision_backend_1

# Accéder à un container en cours d'exécution
docker exec -it kidneyvision_backend_1 /bin/bash
```

## 🔧 Configuration Avancée

### 1. Variables d'Environnement

```bash
# Créer un fichier .env à la racine
cat > .env << EOF
# Backend
MODEL_PATH=/app/checkpoints/kidney_model.h5
UPLOAD_DIR=/app/uploads
RESULTS_DIR=/app/results
DATABASE_URL=postgresql://admin:secure_password@database:5432/kidneyvision

# Frontend
VITE_API_URL=http://localhost:8000
VITE_MAX_FILE_SIZE=50

# Base de données
POSTGRES_DB=kidneyvision
POSTGRES_USER=admin
POSTGRES_PASSWORD=secure_password
EOF
```

### 2. Volumes Persistants

```yaml
volumes:
  # Données de la base
  postgres_data:
    driver: local
  
  # Cache Redis
  redis_data:
    driver: local
  
  # Modèles IA
  model_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: ./backend/checkpoints
  
  # Uploads utilisateurs
  upload_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: ./backend/uploads
```

## 🚀 Build et Déploiement

### 1. Build des Images

```bash
# Build toutes les images
docker-compose -f docker-compose.full.yml build

# Build une image spécifique
docker-compose -f docker-compose.full.yml build backend

# Build sans cache
docker-compose -f docker-compose.full.yml build --no-cache

# Build avec options avancées
docker-compose -f docker-compose.full.yml build --parallel
```

### 2. Déploiement avec Registry

```bash
# Tag des images pour le registry
docker tag kidneyvision_backend:latest your-registry.com/kidneyvision-backend:v1.0
docker tag kidneyvision_frontend:latest your-registry.com/kidneyvision-frontend:v1.0

# Push vers le registry
docker push your-registry.com/kidneyvision-backend:v1.0
docker push your-registry.com/kidneyvision-frontend:v1.0

# Pull et déployer sur le serveur de production
docker pull your-registry.com/kidneyvision-backend:v1.0
docker pull your-registry.com/kidneyvision-frontend:v1.0
```

## 🔒 Sécurité Docker

### 1. Bonnes Pratiques

```dockerfile
# Utiliser des images de base officielles
FROM python:3.10-slim

# Créer un utilisateur non-root
RUN adduser --disabled-password --gecos '' appuser
USER appuser

# Utiliser des secrets pour les mots de passe
# docker-compose.yml
secrets:
  db_password:
    file: ./secrets/db_password.txt

services:
  backend:
    secrets:
      - db_password
```

### 2. Scan de Sécurité

```bash
# Scanner les vulnérabilités
docker scan kidneyvision_backend:latest
docker scan kidneyvision_frontend:latest

# Utiliser Trivy pour un scan approfondi
trivy image kidneyvision_backend:latest
```

## 🐛 Dépannage Docker

### 1. Problèmes Courants

```bash
# Port déjà utilisé
docker-compose down
sudo lsof -ti:3000 | xargs kill -9

# Problèmes de permissions
sudo chown -R $USER:$USER ./backend/uploads

# Problèmes de réseau
docker network ls
docker network prune

# Nettoyage complet
docker system prune -a
docker volume prune
```

### 2. Debug des Containers

```bash
# Vérifier les logs d'erreur
docker-compose logs backend | grep ERROR

# Tester la connectivité réseau
docker exec -it kidneyvision_backend_1 ping frontend

# Vérifier les variables d'environnement
docker exec -it kidneyvision_backend_1 env
```

## 📈 Optimisation Performance

### 1. Optimisation des Images

```dockerfile
# Utiliser des images multi-stage
FROM node:18-alpine as build
# ... étapes de build

FROM nginx:alpine as production
# ... copier seulement les fichiers nécessaires

# Optimiser les layers
RUN apt-get update && apt-get install -y \
    package1 \
    package2 \
    && rm -rf /var/lib/apt/lists/*
```

### 2. Configuration Production

```yaml
# docker-compose.prod.yml
services:
  backend:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```
