
interface PredictionResponse {
  prediction: 'stone' | 'normal' | 'kidney_stone' | 'no_kidney_stone';
  confidence: number;
  heatmap_url?: string;
  processing_time?: number;
  model_version?: string;
}

interface ApiError {
  detail: string;
  status_code: number;
}

class KidneyStoneAPI {
  private baseUrl: string;

  constructor() {
    // Configuration de l'URL du backend
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    console.log('API Base URL:', this.baseUrl);
  }

  async predictKidneyStone(imageFile: File): Promise<PredictionResponse> {
    // Validation du fichier côté client
    if (!this.isValidImageFile(imageFile)) {
      throw new Error('Format de fichier non supporté. Utilisez JPG, PNG ou DICOM.');
    }

    if (imageFile.size > 50 * 1024 * 1024) { // 50MB
      throw new Error('Fichier trop volumineux. Taille maximale : 50MB.');
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      console.log('Envoi de la requête à:', `${this.baseUrl}/predict`);
      console.log('Fichier:', { name: imageFile.name, size: imageFile.size, type: imageFile.type });
      
      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        body: formData,
        // Ne pas définir Content-Type manuellement pour FormData
        headers: {
          // Ajouter des headers personnalisés si nécessaire
          'Accept': 'application/json',
        },
      });

      console.log('Statut de la réponse:', response.status);

      if (!response.ok) {
        let errorMessage = `Erreur HTTP ${response.status}`;
        
        try {
          const errorData: ApiError = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch {
          // Si la réponse n'est pas du JSON valide
          errorMessage = `${errorMessage}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Réponse reçue:', data);

      // Normaliser la réponse selon différents formats possibles
      return this.normalizeResponse(data);
    } catch (error) {
      console.error('Erreur lors de la prédiction:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Impossible de se connecter au serveur (${this.baseUrl}). Vérifiez que le backend est démarré.`);
      }
      
      throw error;
    }
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      // Types DICOM
      'application/dicom',
      'application/octet-stream'
    ];
    
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.dcm', '.dicom'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    return validTypes.includes(file.type) || validExtensions.includes(fileExtension);
  }

  private normalizeResponse(data: any): PredictionResponse {
    // Adapter la réponse selon différents formats de backend
    const prediction = data.prediction || data.class || 'unknown';
    const confidence = data.confidence || data.probability || data.score || 0;
    
    // Normaliser la prédiction
    let normalizedPrediction: 'stone' | 'normal' = 'normal';
    if (prediction.toLowerCase().includes('stone') || prediction.toLowerCase().includes('kidney_stone')) {
      normalizedPrediction = 'stone';
    }

    return {
      prediction: normalizedPrediction,
      confidence: Math.min(Math.max(confidence, 0), 1), // S'assurer que c'est entre 0 et 1
      heatmap_url: data.heatmap_url || data.heatmapUrl,
      processing_time: data.processing_time || data.processingTime,
      model_version: data.model_version || data.modelVersion
    };
  }

  // Méthode pour tester la connexion au backend
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { status: 'success', message: 'Backend accessible' };
      } else {
        return { status: 'error', message: `Backend inaccessible (${response.status})` };
      }
    } catch (error) {
      return { 
        status: 'error', 
        message: `Impossible de joindre le backend: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
      };
    }
  }

  // Méthode pour obtenir les statistiques du modèle (si disponible)
  async getModelStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.warn('Stats non disponibles:', error);
      return null;
    }
  }
}

export const kidneyStoneAPI = new KidneyStoneAPI();
export type { PredictionResponse, ApiError };
