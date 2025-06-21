
# KidneyVision - Détection intelligente des calculs rénaux

<div align="center">
  <img src="public/placeholder.svg" alt="KidneyVision Logo" width="120" height="120" />
  
  <p align="center">
    Application d'IA médicale pour l'analyse d'images radiologiques
    <br />
    <a href="https://lovable.dev/projects/7d78e6df-c085-439d-8b06-de9ed591d35b"><strong>Voir le projet »</strong></a>
    <br />
    <br />
    <a href="#captures-décran">Captures d'écran</a>
    ·
    <a href="#installation">Installation</a>
    ·
    <a href="#déploiemen<img width="622" alt="Capture d'écran 2025-06-21 031059" src="https://github.com/user-attachments/assets/7ad5c992-c3eb-4c2a-9a21-0c7e3e4e1d4c" />
t-docker">Déploiement Docker</a>
  </p>
</div>

## 📸 Captures d'écran

### Interface principale
<img width="622" alt="Capture d'écran 2025-06-21 031059" src="https://github.com/user-attachments/assets/a7a1d889-1b5f-4bbe-9469-c0fdc07133f1" />


*Interface utilisateur intuitive pour l'upload et l'analyse d'images médicales*

### Résultats d'analyse
![Résultats d'analyse avec heatmap](public/placeholder.svg)
*Affichage des résultats de prédiction avec visualisation heatmap et score de confiance*

### Upload d'image
![Zone de glisser-déposer](public/placeholder.svg)
*Zone de glisser-déposer responsive pour l'upload d'images radiologiques*

## 🚀 Technologies utilisées

- **Frontend**: React 18, TypeScript, Vite
- **UI/UX**: Tailwind CSS, shadcn/ui
- **État**: TanStack Query (React Query)
- **Routage**: React Router
- **Icons**: Lucide React
- **Déploiement**: Docker, Nginx

## 📋 Prérequis

- Node.js 18+ et npm
- Docker et Docker Compose (pour le déploiement)
- Backend FastAPI avec endpoint `/predict`

## 🛠️ Installation locale

```bash
# Cloner le repository
git clone <votre-repo-url>
cd kidneyvision

# Installer les dépendances
npm install

# Créer le fichier d'environnement
cp .env.example .env

# Configurer l'URL de votre API
echo "VITE_API_URL=http://localhost:8000" > .env

# Lancer en mode développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🐳 Déploiement Docker

### Déploiement rapide (Production)

```bash
# Build et lancement avec Docker Compose
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

L'application sera accessible sur `http://localhost:3000`

### Développement avec Docker

```bash
# Lancer en mode développement
docker-compose -f docker-compose.dev.yml up

# Avec rebuild forcé
docker-compose -f docker-compose.dev.yml up --build

# Arrêter le développement
docker-compose -f docker-compose.dev.yml down
```

L'application de développement sera accessible sur `http://localhost:8080`

### Build manuel de l'image

```bash
# Build de l'image frontend
docker build -t kidneyvision-frontend .

# Lancer le container
docker run -d \
  --name kidneyvision-app \
  -p 3000:80 \
  -e VITE_API_URL=https://votre-backend-url.com \
  kidneyvision-frontend

# Voir les logs
docker logs kidneyvision-app

# Arrêter le container
docker stop kidneyvision-app && docker rm kidneyvision-app
```

## 🔧 Configuration

### Variables d'environnement

```bash
# .env
VITE_API_URL=https://votre-backend-url.com
```

### Configuration CORS Backend (FastAPI)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Docker frontend
        "http://localhost:8080",      # Dev Docker
        "http://localhost:5173",      # Vite dev server
        "https://*.lovable.app",      # Domaines Lovable
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

## 📱 Scripts disponibles

```bash
# Développement local
npm run dev                    # Serveur de développement Vite
npm run build                  # Build de production
npm run preview                # Prévisualisation du build

# Docker - Développement
docker-compose -f docker-compose.dev.yml up     # Dev avec hot reload
docker-compose -f docker-compose.dev.yml down   # Arrêt dev

# Docker - Production
docker-compose up -d           # Lancement production
docker-compose logs -f         # Logs en temps réel
docker-compose down           # Arrêt production

# Docker - Utilitaires
docker build -t kidneyvision . # Build image manuelle
docker system prune -f        # Nettoyage Docker
```

## 🏥 Fonctionnalités

✅ **Upload d'images** - Glisser-déposer ou sélection de fichiers  
✅ **Analyse IA** - Détection automatique des calculs rénaux  
✅ **Visualisation** - Heatmap des zones détectées  
✅ **Score de confiance** - Évaluation de la fiabilité  
✅ **Interface responsive** - Compatible mobile et desktop  
✅ **Gestion d'erreurs** - Messages d'erreur informatifs  

## 🚀 Déploiement sur Lovable

### Configuration automatique
Lovable détecte automatiquement :
- ✅ Framework : React + Vite
- ✅ Commande d'installation : `npm install`
- ✅ Commande de build : `npm run build`
- ✅ Dossier de build : `dist`

### Déploiement en un clic
1. Cliquez sur **"Publish"** en haut à droite dans Lovable
2. Configurez `VITE_API_URL` dans Project > Settings > Environment
3. Votre app sera accessible via une URL `*.lovable.app`

## 🔍 Troubleshooting

### Erreurs communes

**Erreur CORS**
```bash
# Vérifiez que votre backend autorise l'origine du frontend
# Ajoutez l'URL dans les origins CORS de votre API
```

**Container ne démarre pas**
```bash
# Vérifiez les logs
docker-compose logs frontend

# Vérifiez que le port n'est pas utilisé
lsof -i :3000
```

**Erreur de build**
```bash
# Nettoyez et rebuild
docker-compose down
docker system prune -f
docker-compose up --build
```

## 📊 Monitoring

### Health checks
- **Frontend** : `http://localhost:3000/health`
- **Status API** : Intégré dans l'interface utilisateur

### Logs Docker
```bash
# Logs de tous les services
docker-compose logs -f

# Logs du frontend uniquement
docker-compose logs -f frontend

# Logs avec timestamps
docker-compose logs -f -t
```

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Documentation** : [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Issues** : [GitHub Issues](https://github.com/votre-repo/issues)
- **Lovable** : [Project Dashboard](https://lovable.dev/projects/7d78e6df-c085-439d-8b06-de9ed591d35b)

---

<div align="center">
  Développé avec ❤️ pour l'aide au diagnostic médical
  <br />
  <strong>KidneyVision</strong> - Technologie d'IA au service de la santé
</div>
