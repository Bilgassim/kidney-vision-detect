
# Guide d'Installation Détaillé - KidneyVision

## 📋 Prérequis Système

### Minimum
- **Node.js** 18.0+ et npm 8+
- **Python** 3.8+
- **8GB RAM** pour le modèle IA
- **20GB** d'espace disque libre

### Recommandé
- **Node.js** 20.0+ et npm 10+
- **Python** 3.10+
- **16GB RAM** pour de meilleures performances
- **GPU** avec CUDA support (optionnel)
- **Docker** et Docker Compose

## 🛠️ Installation Complète

### 1. Préparation de l'Environnement

```bash
# Créer le dossier principal du projet
mkdir kidneyvision-full
cd kidneyvision-full

# Vérifier les prérequis
node --version    # Doit être >= 18.0
npm --version     # Doit être >= 8.0
python --version  # Doit être >= 3.8
docker --version  # Optionnel mais recommandé
```

### 2. Clonage des Repositories

```bash
# Cloner le frontend
git clone <frontend-repo-url> frontend
cd frontend
npm install
cd ..

# Cloner le backend
git clone https://github.com/Bilgassim/Kidney-stone-detection backend
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Structure Finale du Projet

```
kidneyvision-full/
├── frontend/                 # Interface React
├── backend/                  # API FastAPI + Modèle IA
└── docker-compose.full.yml   # Orchestration complète
```

## ⚙️ Configuration Backend

### 1. Installation des Dépendances Python

```bash
cd backend

# Créer un environnement virtuel (recommandé)
python -m venv venv

# Activer l'environnement virtuel
# Sur Linux/Mac:
source venv/bin/activate
# Sur Windows:
venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt
```

### 2. Structure des Dossiers

```bash
# Créer la structure nécessaire
mkdir -p data/{Normal,stone}
mkdir -p checkpoints
mkdir -p results
mkdir -p uploads

# Vérifier la structure
ls -la
```

### 3. Configuration des Variables d'Environnement

```bash
# Créer le fichier .env
cat > .env << EOF
MODEL_PATH=./checkpoints/kidney_model.h5
UPLOAD_DIR=./uploads
RESULTS_DIR=./results
MAX_FILE_SIZE=50MB
ALLOWED_EXTENSIONS=jpg,jpeg,png,dcm,dicom
CORS_ORIGINS=http://localhost:3000,https://*.lovable.app
EOF
```

### 4. Téléchargement du Modèle (si disponible)

```bash
# Si un modèle pré-entraîné est disponible
# wget <model-url> -O checkpoints/kidney_model.h5

# Ou entraîner un nouveau modèle
python scripts/train_model.py
```

### 5. Lancement du Backend

```bash
# Lancer l'API FastAPI
uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Vérifier que l'API fonctionne
curl http://localhost:8000/health
```

## 🎨 Configuration Frontend

### 1. Installation des Dépendances

```bash
cd frontend

# Installer les dépendances Node.js
npm install

# Vérifier l'installation
npm list --depth=0
```

### 2. Configuration Environnement

```bash
# Créer le fichier .env
echo "VITE_API_URL=http://localhost:8000" > .env

# Pour la production, utilisez l'URL de votre backend déployé
# echo "VITE_API_URL=https://your-backend-domain.com" > .env
```

### 3. Variables d'Environnement Disponibles

```bash
# frontend/.env
VITE_API_URL=http://localhost:8000
VITE_MAX_FILE_SIZE=50
VITE_ALLOWED_FORMATS=jpg,png,jpeg,dcm,dicom
VITE_ENABLE_DEBUG=true
```

### 4. Lancement du Frontend

```bash
# Mode développement
npm run dev

# L'application sera accessible sur http://localhost:5173
```

## 🔧 Configuration Avancée

### 1. Configuration Base de Données (Backend)

```python
# backend/database.py
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./kidneyvision.db")

# Pour PostgreSQL:
# DATABASE_URL = "postgresql://user:password@localhost/kidneyvision"

# Pour MySQL:
# DATABASE_URL = "mysql://user:password@localhost/kidneyvision"
```

### 2. Configuration CORS (Backend)

```python
# backend/app.py
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://*.lovable.app",
    "https://your-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

### 3. Configuration Logging

```python
# backend/logging_config.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

## 🧪 Tests et Validation

### 1. Tests Backend

```bash
cd backend

# Installer les dépendances de test
pip install pytest pytest-asyncio httpx

# Lancer les tests
pytest tests/ -v

# Tests avec couverture
pytest tests/ --cov=app --cov-report=html
```

### 2. Tests Frontend

```bash
cd frontend

# Lancer les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests end-to-end (si configurés)
npm run test:e2e
```

## ⚡ Optimisation Performance

### 1. Backend

```bash
# Installer des dépendances optionnelles pour les performances
pip install uvloop
pip install gunicorn

# Lancer avec Gunicorn pour la production
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 2. Frontend

```bash
# Build optimisé pour la production
npm run build

# Analyser la taille du bundle
npm run build:analyze

# Servir les fichiers statiques
npm run preview
```

## 🐛 Résolution de Problèmes

### Problèmes Courants Backend

```bash
# Erreur: Module 'tensorflow' not found
pip install tensorflow

# Erreur: Port 8000 déjà utilisé
lsof -ti:8000 | xargs kill -9

# Erreur: Permissions sur les dossiers
chmod -R 755 uploads results checkpoints
```

### Problèmes Courants Frontend

```bash
# Erreur: CORS
# Vérifiez la configuration CORS du backend

# Erreur: Module not found
rm -rf node_modules package-lock.json
npm install

# Erreur: Build failed
npm run build:clean
npm run build
```

## 📊 Vérification de l'Installation

### 1. Checklist Backend

- [ ] API accessible sur http://localhost:8000
- [ ] Documentation Swagger sur http://localhost:8000/docs
- [ ] Endpoint `/health` retourne 200
- [ ] Upload d'image fonctionne
- [ ] Prédiction retourne un résultat

### 2. Checklist Frontend

- [ ] Interface accessible sur http://localhost:5173
- [ ] Upload d'images fonctionne
- [ ] Visualiseur DICOM s'affiche
- [ ] Dashboard montre les métriques
- [ ] Pas d'erreurs dans la console

### 3. Test de Bout en Bout

```bash
# Test avec curl
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.jpg"

# Réponse attendue
{
  "prediction": "no_kidney_stone",
  "confidence": 0.85,
  "heatmap_url": "http://localhost:8000/results/heatmap_123.jpg"
}
```

## 🚀 Mise en Production

### 1. Préparation

```bash
# Variables d'environnement production
export NODE_ENV=production
export VITE_API_URL=https://your-api-domain.com
export DATABASE_URL=postgresql://user:pass@host/db
```

### 2. Build et Déploiement

```bash
# Build frontend
cd frontend
npm run build

# Le dossier dist/ contient les fichiers à déployer

# Configuration backend pour production
cd backend
pip install gunicorn
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker
```

Pour des instructions de déploiement spécifiques, consultez [DOCKER.md](DOCKER.md) et [CLOUD_DEPLOYMENT.md](CLOUD_DEPLOYMENT.md).
