
import { useState } from 'react';
import { toast } from 'sonner';
import { kidneyStoneAPI, PredictionResponse } from '@/services/api';

interface UseImageAnalysisReturn {
  selectedImage: File | null;
  isAnalyzing: boolean;
  analysisResult: PredictionResponse | null;
  handleImageSelect: (file: File) => void;
  handleClearImage: () => void;
  handleAnalyze: () => Promise<void>;
  handleNewAnalysis: () => void;
  transformPredictionForAnalysis: (prediction: PredictionResponse) => {
    hasKidneyStone: boolean;
    confidence: number;
    heatmapUrl?: string;
  };
}

export const useImageAnalysis = (onAnalysisComplete?: () => void): UseImageAnalysisReturn => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PredictionResponse | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setAnalysisResult(null);
    console.log('Image sélectionnée:', file.name);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error('Veuillez d\'abord sélectionner une image');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      console.log('Début de l\'analyse pour:', selectedImage.name);
      const result = await kidneyStoneAPI.predictKidneyStone(selectedImage);
      setAnalysisResult(result);
      
      const predictionText = result.prediction === 'stone' ? 'Calcul rénal détecté' : 'Pas de calcul rénal détecté';
      toast.success(`Analyse terminée: ${predictionText} (${(result.confidence * 100).toFixed(1)}% de confiance)`);
      console.log('Résultat de l\'analyse:', result);
      
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  const transformPredictionForAnalysis = (prediction: PredictionResponse) => ({
    hasKidneyStone: prediction.prediction === 'stone',
    confidence: prediction.confidence,
    heatmapUrl: prediction.heatmap_url
  });

  return {
    selectedImage,
    isAnalyzing,
    analysisResult,
    handleImageSelect,
    handleClearImage,
    handleAnalyze,
    handleNewAnalysis,
    transformPredictionForAnalysis
  };
};
