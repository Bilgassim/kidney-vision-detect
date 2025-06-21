
# Guide de déploiement - KidneyVision

## 🐳 Déploiement avec Docker (Recommandé)

### Prérequis
- Docker et Docker Compose installés
- Backend FastAPI prêt avec support CORS

### 1. Déploiement rapide avec Docker Compose

```bash
# Cloner le projet
git clone <votre-repo>
cd kidneyvision

# Créer le fichier .env
cp .env.example .env
# Modifier VITE_API_URL=http://localhost:8000

# Lancer les services
docker-compose up -d

# Vérifier les logs
docker-compose logs -f
```

L'application sera accessible sur http://localhost:3000

### 2. Build et déploiement manuel

```bash
# Build de l'image frontend
docker build -t kidneyvision-frontend .

# Lancer le container
docker run -d \
  --name kidneyvision-app \
  -p 3000:80 \
  -e VITE_API_URL=https://votre-backend-url.com \
  kidneyvision-frontend
```

### 3. Développement avec Docker

```bash
# Lancer en mode développement
docker-compose -f docker-compose.dev.yml up

# Accéder à l'app sur http://localhost:8080
```

### 4. Production avec registre Docker

```bash
# Tag et push vers votre registre
docker tag kidneyvision-frontend your-registry/kidneyvision:latest
docker push your-registry/kidneyvision:latest

# Déployer depuis le registre
docker run -d \
  --name kidneyvision-prod \
  -p 80:80 \
  -e VITE_API_URL=https://api.votre-domaine.com \
  your-registry/kidneyvision:latest
```

## ☁️ Déploiement sur Lovable (Alternative)

### Configuration automatique
Lovable détecte automatiquement :
- ✅ Framework : React + Vite
- ✅ Commande d'installation : `npm install`
- ✅ Commande de build : `npm run build`
- ✅ Dossier de build : `dist`

### Déploiement automatique
1. Cliquez sur le bouton "Publish" en haut à droite
2. Votre app sera accessible via une URL `*.lovable.app`
3. Configurez vos variables d'environnement dans Project > Settings

## 🔧 Configuration

### Variables d'environnement
```bash
# .env
VITE_API_URL=https://votre-backend-url.com
```

### Configuration CORS sur votre backend FastAPI
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Docker frontend
        "http://localhost:8080",  # Développement local
        "https://*.lovable.app",  # Domaines Lovable
        "https://your-custom-domain.com",  # Votre domaine
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

### Format de réponse API requis
```json
{
  "prediction": "kidney_stone" | "no_kidney_stone",
  "confidence": 0.85,
  "heatmap_url": "https://url-vers-votre-image-heatmap.jpg"
}
```

## 🚀 Scripts utiles

```bash
# Build local
npm run build

# Développement local
npm run dev

# Docker - Build image
docker build -t kidneyvision .

# Docker - Développement
docker-compose -f docker-compose.dev.yml up

# Docker - Production
docker-compose up -d

# Docker - Logs
docker-compose logs -f frontend

# Docker - Arrêt
docker-compose down
```

## 🔍 Troubleshooting

### Erreur CORS
- Vérifiez que votre backend autorise l'origine du frontend
- Ajoutez l'URL de votre container dans les origins autorisés

### Erreur de connexion API
- Vérifiez que `VITE_API_URL` pointe vers l'URL correcte
- En mode Docker, utilisez les noms de services dans le réseau

### Container ne démarre pas
- Vérifiez les logs : `docker-compose logs frontend`
- Vérifiez que le port n'est pas déjà utilisé

## 📊 Monitoring

### Health checks
- Frontend : http://localhost:3000/health
- API status intégré dans l'application

### Logs
```bash
# Logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f frontend
```
