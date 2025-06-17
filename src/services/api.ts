
interface PredictionResponse {
  hasKidneyStone: boolean;
  confidence: number;
  heatmapUrl?: string;
}

class KidneyStoneAPI {
  private baseUrl: string;

  constructor() {
    // URL de votre backend FastAPI déployé
    this.baseUrl = import.meta.env.VITE_API_URL || 'https://your-backend-url.com';
  }

  async predictKidneyStone(imageFile: File): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      console.log('Envoi de la requête à:', `${this.baseUrl}/predict`);
      
      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        body: formData,
        headers: {
          // Ne pas définir Content-Type manuellement pour les FormData
          // Le navigateur le fera automatiquement avec la boundary
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Réponse reçue:', data);

      // Adapter la réponse selon le format de votre API
      return {
        hasKidneyStone: data.prediction === 'kidney_stone' || data.has_kidney_stone || false,
        confidence: data.confidence || data.probability || 0,
        heatmapUrl: data.heatmap_url || data.heatmapUrl
      };
    } catch (error) {
      console.error('Erreur lors de la prédiction:', error);
      throw new Error(`Impossible de se connecter au serveur d'analyse. Vérifiez que votre backend est accessible.`);
    }
  }

  // Méthode pour tester la connexion au backend
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const kidneyStoneAPI = new KidneyStoneAPI();
export type { PredictionResponse };
