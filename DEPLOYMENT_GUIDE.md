
# Guide de déploiement - KidneyVision

## Configuration requise

### 1. Variables d'environnement
Créez un fichier `.env` à la racine du projet avec :
```
VITE_API_URL=https://votre-backend-url.com
```

### 2. Configuration CORS sur votre backend FastAPI
Assurez-vous que votre backend FastAPI accepte les requêtes depuis Lovable :

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://*.lovable.app",  # Domaines Lovable
        "https://your-custom-domain.com",  # Votre domaine personnalisé
        "http://localhost:3000",  # Développement local
        "http://localhost:8080",  # Développement local Lovable
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

### 3. Format de réponse attendu de votre API
Votre endpoint `/predict` doit retourner :

```json
{
  "prediction": "kidney_stone" | "no_kidney_stone",
  "confidence": 0.85,
  "heatmap_url": "https://url-vers-votre-image-heatmap.jpg"
}
```

OU

```json
{
  "has_kidney_stone": true,
  "probability": 0.85,
  "heatmapUrl": "https://url-vers-votre-image-heatmap.jpg"
}
```

## Déploiement sur Lovable

### 1. Configuration automatique
Lovable détecte automatiquement :
- ✅ Framework : React + Vite
- ✅ Commande d'installation : `npm install`
- ✅ Commande de build : `npm run build`
- ✅ Dossier de build : `dist`

### 2. Déploiement automatique
1. Cliquez sur le bouton "Publish" en haut à droite
2. Votre app sera accessible via une URL `*.lovable.app`
3. Configurez vos variables d'environnement dans Project > Settings

### 3. Intégration GitHub pour redéploiement automatique
1. Connectez votre projet à GitHub via le bouton GitHub
2. Chaque push sur la branche principale redéploiera automatiquement
3. Vous pouvez suivre le statut des déploiements dans l'interface Lovable

### 4. Domaine personnalisé
1. Allez dans Project > Settings > Domains
2. Ajoutez votre domaine personnalisé
3. Configurez vos DNS selon les instructions

## Test de l'API

Vous pouvez tester votre backend avec cette commande curl :

```bash
curl -X POST "https://votre-backend-url.com/predict" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@votre-image.jpg"
```

## Troubleshooting

### Erreur CORS
- Vérifiez que votre backend autorise les domaines Lovable
- Ajoutez `https://*.lovable.app` dans vos origins autorisés

### Erreur 404 sur l'API
- Vérifiez que `VITE_API_URL` est correctement configuré
- Testez votre endpoint `/predict` indépendamment

### Image non affichée
- Assurez-vous que `heatmap_url` retourne une URL publique accessible
- Vérifiez que l'image a les bons headers CORS
