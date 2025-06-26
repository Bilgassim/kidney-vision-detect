
# KidneyVision - Système de Détection des Calculs Rénaux
<div align="center">
  <video href="https://github.com/user-attachments/assets/6f106ea0-7893-4b3d-b30d-bd03263fb8a4"> Backend </video> <span>
  <video href="https://github.com/user-attachments/assets/661e4807-66a3-4234-a359-48482e3ea140"> Frontend </video>
</div>
<div align="center">
  
  <p align="center">
    Système d'IA médicale complet pour l'analyse d'images radiologiques
    <br />
    <strong>Frontend React + Backend FastAPI + Modèle Deep Learning</strong>
    <br />
    <br />
    <a href="#captures-décran">Captures d'écran</a>
    ·
    <a href="ARCHITECTURE.md">Architecture</a>
    ·
    <a href="INSTALLATION.md">Installation</a>
    ·
    <a href="CLOUD_DEPLOYMENT.md">Déploiement Cloud</a>
  </p>
</div>

## 📸 Captures d'écran

### Interface Principale
<img width="937" alt="Image" src="https://github.com/user-attachments/assets/ff378eca-89a9-46af-a783-dbd6ad48b308" />

### Upload et Analyse d'Images
<img width="939" alt="Image" src="https://github.com/user-attachments/assets/b9f2e187-e2ad-4446-90c6-a262433fee96" />
<img width="936" alt="Image" src="https://github.com/user-attachments/assets/913ec9f2-be76-4f54-8af1-802108489a71" />
<img width="935" alt="Image" src="https://github.com/user-attachments/assets/bd4af561-9f72-4b88-b640-d0469352eced" />
*Zone de glisser-déposer pour l'upload d'images radiologiques avec support DICOM*

### Dashboard de Performance
<img width="929" alt="Image" src="https://github.com/user-attachments/assets/c1d7657c-590b-4ff8-bdee-4970e8f2c6e8" />
<img width="933" alt="Image" src="https://github.com/user-attachments/assets/c7af77cc-f38c-4613-b726-93d1b239fb50" />
<img width="933" alt="Image" src="https://github.com/user-attachments/assets/bc5ba091-610d-4aac-8819-70875df792ce" />

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** 18+ et npm
- **Python** 3.8+
- **Docker** et Docker Compose (optionnel)

### Installation Express

```bash
# 1. Cloner les projets
mkdir kidneyvision-full && cd kidneyvision-full
git clone <frontend-repo-url> frontend
git clone https://github.com/Bilgassim/Kidney-stone-detection backend

# 2. Lancer avec Docker (recommandé)
docker-compose -f docker-compose.full.yml up -d

# 3. Accéder à l'application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

### Installation Manuelle

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Frontend
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev
```

## 📚 Documentation

- **[Architecture du Système](ARCHITECTURE.md)** - Structure et technologies
- **[Guide d'Installation](INSTALLATION.md)** - Installation détaillée pas à pas
- **[Déploiement Docker](DOCKER.md)** - Conteneurisation et orchestration
- **[Déploiement Cloud](CLOUD_DEPLOYMENT.md)** - AWS, GCP, Azure
- **[API Documentation](API.md)** - Endpoints et formats de réponse
- **[Guide de Contribution](CONTRIBUTING.md)** - Comment contribuer au projet

## 🏥 Workflow Clinique

1. **Upload Image** → Glisser-déposer image DICOM/JPEG
2. **Analyse IA** → Prédiction automatique + heatmap
3. **Validation Expert** → Annotations manuelles si nécessaire
4. **Rapport** → Génération rapport avec confiance
5. **Archivage** → Sauvegarde résultats + métadonnées

## 📊 Performance du Modèle

- **Précision**: 94.2%
- **Rappel**: 96.5%
- **F1-Score**: 94.1%
- **AUC-ROC**: 0.967
- **Temps moyen**: 2.3s par analyse

## 🛠️ Technologies Principales

### Frontend
- React 18, TypeScript, Vite
- Tailwind CSS, shadcn/ui
- TanStack Query, React Router
- Visualiseur DICOM intégré

### Backend
- FastAPI (Python)
- TensorFlow/PyTorch
- OpenCV, pydicom
- SQLite/PostgreSQL

## 🔧 Scripts Utiles

```bash
# Développement
npm run dev                    # Frontend
uvicorn app:app --reload       # Backend

# Docker
docker-compose up -d           # Production
docker-compose -f docker-compose.dev.yml up  # Développement

# Build
npm run build                  # Frontend
docker build -t backend .     # Backend
```

## 📞 Support

- **Frontend Repo**: [GitHub Frontend](https://github.com/votre-frontend-repo)
- **Backend Repo**: [GitHub Backend](https://github.com/Bilgassim/Kidney-stone-detection)
- **Documentation API**: `http://localhost:8000/docs`
- **Discord**: [Lovable Community](https://discord.com/channels/1119885301872070706)

## 📄 Licence

Ce projet est sous licence MIT. Voir les fichiers `LICENSE` des repos respectifs.

---

<div align="center">
  <strong>KidneyVision</strong> - IA Médicale pour la Détection de Calculs Rénaux
  <br />
  Développé avec ❤️ pour améliorer le diagnostic médical
</div>
