
# Documentation API - KidneyVision

## 🔗 Endpoints Disponibles

### Base URL
- **Développement**: `http://localhost:8000`
- **Production**: `https://your-api-domain.com`

### Documentation Interactive
- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI Schema**: `/openapi.json`

## 🏥 Endpoints Principaux

### 1. Health Check

```http
GET /health
```

**Réponse:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

### 2. Analyse d'Image

```http
POST /analyze
Content-Type: multipart/form-data
```

**Paramètres:**
- `file`: Fichier image (DICOM, JPEG, PNG)
- `patient_id` (optionnel): Identifiant patient
- `study_id` (optionnel): Identifiant étude

**Exemple cURL:**
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@kidney_image.dcm" \
  -F "patient_id=P12345" \
  -F "study_id=S67890"
```

**Réponse:**
```json
{
  "prediction": "kidney_stone",
  "confidence": 0.923,
  "heatmap_url": "http://localhost:8000/results/heatmap_abc123.jpg",
  "processing_time": 2.34,
  "model_version": "v1.2.0",
  "analysis_id": "abc123",
  "metadata": {
    "image_format": "DICOM",
    "image_size": [512, 512],
    "patient_id": "P12345",
    "study_id": "S67890"
  }
}
```

**Codes de Statut:**
- `200`: Analyse réussie
- `400`: Fichier invalide ou manquant
- `413`: Fichier trop volumineux
- `415`: Format de fichier non supporté
- `500`: Erreur serveur

### 3. Récupération des Résultats

```http
GET /results/{analysis_id}
```

**Réponse:**
```json
{
  "analysis_id": "abc123",
  "prediction": "kidney_stone",
  "confidence": 0.923,
  "heatmap_url": "http://localhost:8000/results/heatmap_abc123.jpg",
  "created_at": "2024-01-15T10:30:00Z",
  "metadata": {
    "processing_time": 2.34,
    "model_version": "v1.2.0",
    "image_format": "DICOM"
  }
}
```

### 4. Téléchargement de Carte de Chaleur

```http
GET /results/heatmap/{analysis_id}
```

**Réponse:** Image JPEG de la carte de chaleur

### 5. Statistiques du Modèle

```http
GET /stats
```

**Réponse:**
```json
{
  "model_performance": {
    "precision": 0.942,
    "recall": 0.965,
    "f1_score": 0.941,
    "auc_roc": 0.967
  },
  "usage_stats": {
    "total_analyses": 15432,
    "analyses_today": 127,
    "average_processing_time": 2.1,
    "success_rate": 0.982
  },
  "model_info": {
    "version": "v1.2.0",
    "last_updated": "2024-01-10T08:00:00Z",
    "training_dataset_size": 50000
  }
}
```

## 🔧 Formats de Données

### Types de Prédiction
- `kidney_stone`: Calcul rénal détecté
- `no_kidney_stone`: Pas de calcul rénal détecté

### Formats d'Image Supportés
- **DICOM**: `.dcm`, `.dicom`
- **JPEG**: `.jpg`, `.jpeg`
- **PNG**: `.png`

### Limites
- **Taille maximale**: 50 MB par fichier
- **Résolution**: Minimum 256x256, Maximum 2048x2048
- **Rate limiting**: 100 requêtes/minute par IP

## 🚨 Gestion d'Erreurs

### Format d'Erreur Standard

```json
{
  "error": {
    "code": "INVALID_FILE_FORMAT",
    "message": "Le format de fichier n'est pas supporté",
    "details": "Formats acceptés: DICOM, JPEG, PNG",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Codes d'Erreur Communs

| Code | Description |
|------|-------------|
| `INVALID_FILE_FORMAT` | Format de fichier non supporté |
| `FILE_TOO_LARGE` | Fichier dépasse la limite de taille |
| `MISSING_FILE` | Aucun fichier fourni |
| `PROCESSING_ERROR` | Erreur lors du traitement |
| `MODEL_UNAVAILABLE` | Modèle IA indisponible |
| `RATE_LIMIT_EXCEEDED` | Limite de requêtes dépassée |

## 🔐 Authentification (Futur)

### Headers Requis (à implémenter)

```http
Authorization: Bearer your-jwt-token
X-API-Key: your-api-key
```

### Obtenir un Token

```http
POST /auth/login
Content-Type: application/json

{
  "username": "doctor@hospital.com",
  "password": "secure_password"
}
```

## 📊 Endpoints de Monitoring

### 1. Métriques Système

```http
GET /metrics
```

**Réponse (format Prometheus):**
```
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="POST",endpoint="/analyze"} 1543

# HELP processing_time_seconds Time spent processing requests
# TYPE processing_time_seconds histogram
processing_time_seconds_bucket{le="1.0"} 234
processing_time_seconds_bucket{le="2.0"} 1234
```

### 2. Status Détaillé

```http
GET /status
```

**Réponse:**
```json
{
  "status": "healthy",
  "services": {
    "database": "healthy",
    "model": "healthy",
    "storage": "healthy"
  },
  "system": {
    "cpu_usage": 45.2,
    "memory_usage": 72.1,
    "disk_usage": 23.8
  },
  "uptime": "2d 14h 32m"
}
```

## 🧪 Exemples d'Utilisation

### Python avec requests

```python
import requests

# Analyser une image
with open('kidney_scan.dcm', 'rb') as f:
    files = {'file': f}
    response = requests.post(
        'http://localhost:8000/analyze',
        files=files
    )

result = response.json()
print(f"Prédiction: {result['prediction']}")
print(f"Confiance: {result['confidence']:.2%}")
```

### JavaScript avec fetch

```javascript
const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:8000/analyze', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  return result;
};

// Utilisation
const fileInput = document.getElementById('file-input');
const result = await analyzeImage(fileInput.files[0]);
console.log('Résultat:', result);
```

### cURL Complet

```bash
# Analyser une image avec métadonnées
curl -X POST "http://localhost:8000/analyze" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_image.dcm;type=application/dicom" \
  -F "patient_id=P12345" \
  -F "study_id=S67890"

# Récupérer les statistiques
curl -X GET "http://localhost:8000/stats" \
  -H "accept: application/json"

# Vérifier la santé de l'API
curl -X GET "http://localhost:8000/health" \
  -H "accept: application/json"
```

## 🔄 Webhook (Futur)

### Configuration Webhook

```http
POST /webhooks
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["analysis.completed", "analysis.failed"],
  "secret": "webhook_secret"
}
```

### Format Webhook

```json
{
  "event": "analysis.completed",
  "analysis_id": "abc123",
  "data": {
    "prediction": "kidney_stone",
    "confidence": 0.923,
    "patient_id": "P12345"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 📝 Logs et Debugging

### Activation des Logs Détaillés

```bash
# Variable d'environnement
export LOG_LEVEL=DEBUG

# Headers de debug
X-Debug: true
X-Trace-ID: custom-trace-id
```

### Format des Logs

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "message": "Analysis completed",
  "context": {
    "analysis_id": "abc123",
    "processing_time": 2.34,
    "model_version": "v1.2.0"
  }
}
```

## 📋 Changelog API

### v1.2.0 (Actuel)
- Ajout support format PNG
- Amélioration précision modèle
- Optimisation temps de traitement

### v1.1.0
- Support DICOM natif
- Génération cartes de chaleur
- Endpoints de monitoring

### v1.0.0
- Version initiale
- Support JPEG uniquement
- Prédiction basique
