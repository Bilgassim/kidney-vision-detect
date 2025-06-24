
# Architecture du Système KidneyVision

## 🏗️ Vue d'Ensemble

```
KidneyVision/
├── Frontend (React + TypeScript)
│   ├── Interface utilisateur responsive
│   ├── Visualiseur DICOM interactif
│   ├── Outils d'annotation manuelle
│   └── Dashboard de performance
│
└── Backend (FastAPI + Deep Learning)
    ├── API REST pour prédictions
    ├── Modèle de détection CNN
    ├── Génération de cartes de chaleur
    └── Gestion des fichiers DICOM
```

## 🎯 Technologies Utilisées

### Frontend
- **Framework**: React 18, TypeScript, Vite
- **UI/UX**: Tailwind CSS, shadcn/ui
- **État**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Visualisation**: DICOM viewer avec annotations
- **Icons**: Lucide React
- **Charts**: Recharts pour les métriques

### Backend
- **API**: FastAPI (Python)
- **IA**: TensorFlow/PyTorch pour détection
- **Traitement**: OpenCV, PIL pour images
- **DICOM**: pydicom pour fichiers médicaux
- **Base de données**: SQLite/PostgreSQL
- **Validation**: Pydantic pour les schémas

### Déploiement
- **Conteneurisation**: Docker & Docker Compose
- **Cloud**: AWS/GCP/Azure ready
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions

## 📁 Structure Backend

```
kidney-stone-detection/
├── data/
│   ├── Normal/               # Images de reins normaux
│   └── stone/                # Images avec calculs rénaux
├── checkpoints/
│   └── training.log          # Logs d'entraînement
├── results/
│   ├── Figure_1.png          # Visualisations générées
│   ├── all_metadata.csv      # Métadonnées complètes
│   └── training_log.json     # Historique d'entraînement
├── scripts/                  # Scripts de prétraitement
├── notebooks/                # Jupyter notebooks
├── app.py                    # API FastAPI principale
├── requirements.txt          # Dépendances Python
└── README.md
```

## 📁 Structure Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/               # Composants shadcn/ui
│   │   ├── DicomViewer.tsx   # Visualiseur DICOM
│   │   ├── ImageUpload.tsx   # Upload d'images
│   │   └── PerformanceDashboard.tsx
│   ├── hooks/
│   │   └── useDicomViewer.ts # Hook personnalisé DICOM
│   ├── pages/
│   │   └── Index.tsx         # Page principale
│   ├── services/
│   │   └── api.ts            # Appels API
│   └── types/
│       └── dicom.ts          # Types TypeScript
├── public/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🔄 Flux de Données

### 1. Upload et Traitement
```
Client → Frontend → Backend API → Modèle IA → Résultats
```

### 2. Communication API
```typescript
// Format de requête
POST /analyze
{
  "image": "base64_encoded_image",
  "format": "dicom" | "jpeg" | "png"
}

// Format de réponse
{
  "prediction": "kidney_stone" | "no_kidney_stone",
  "confidence": 0.92,
  "heatmap_url": "https://api.domain.com/results/heatmap_123.jpg",
  "processing_time": 2.3,
  "model_version": "v1.2.0"
}
```

## 🛡️ Sécurité

### Frontend
- Validation côté client des fichiers
- Sanitisation des données utilisateur
- HTTPS obligatoire en production
- CSP (Content Security Policy)

### Backend
- Validation Pydantic des entrées
- Limitation de taille des fichiers
- CORS configuré pour origines autorisées
- Rate limiting sur les endpoints

### Déploiement
- Secrets management avec variables d'environnement
- Isolation des containers Docker
- Network segmentation
- Health checks automatiques

## 📊 Monitoring et Observabilité

### Métriques Système
- Temps de réponse API
- Usage CPU/mémoire
- Taux d'erreur
- Débit de requêtes

### Métriques Métier
- Précision du modèle
- Temps de traitement moyen
- Volume d'analyses quotidiennes
- Taux de validation manuelle

## 🔧 Intégrations

### Services Externes
- Stockage cloud (S3, GCS, Azure Blob)
- CDN pour les images
- Services de notification
- Systèmes de monitoring (Grafana, Prometheus)

### APIs Tierces
- Services DICOM (PACS)
- Systèmes d'information hospitaliers (HIS)
- Bases de données médicales
- Services d'authentification (OAuth, SAML)

## 🚀 Évolutivité

### Horizontale
- Load balancing frontend/backend
- Réplication base de données
- Mise en cache distribuée (Redis)
- CDN pour ressources statiques

### Verticale
- Optimisation GPU pour le modèle IA
- Augmentation ressources containers
- Optimisation base de données
- Compression d'images
