
import React, { useState } from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import AnalysisResults from '@/components/AnalysisResults';
import { kidneyStoneAPI, PredictionResponse } from '@/services/api';
import { Button } from '@/components/ui/button';
import { RefreshCw, Info } from 'lucide-react';

const Index: React.FC = () => {
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
      
      toast.success('Analyse terminée avec succès');
      console.log('Résultat de l\'analyse:', result);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Section d'information */}
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Comment utiliser KidneyVision
              </h2>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Chargez une image radiologique (scanner, échographie, radiographie)</li>
                <li>• Notre IA analyse l'image pour détecter la présence de calculs rénaux</li>
                <li>• Recevez un résultat avec le niveau de confiance et une carte de chaleur</li>
                <li>• Consultez toujours un professionnel de santé pour un diagnostic définitif</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upload d'image */}
        <ImageUpload
          onImageSelect={handleImageSelect}
          selectedImage={selectedImage}
          onClearImage={handleClearImage}
          isAnalyzing={isAnalyzing}
        />

        {/* Bouton d'analyse */}
        {selectedImage && !analysisResult && (
          <div className="flex justify-center">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                'Analyser l\'image'
              )}
            </Button>
          </div>
        )}

        {/* Résultats de l'analyse */}
        {(analysisResult || isAnalyzing) && (
          <AnalysisResults
            prediction={analysisResult || { hasKidneyStone: false, confidence: 0 }}
            isLoading={isAnalyzing}
          />
        )}

        {/* Bouton nouvelle analyse */}
        {analysisResult && (
          <div className="flex justify-center">
            <Button
              onClick={handleNewAnalysis}
              variant="outline"
              size="lg"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-2"
            >
              Nouvelle analyse
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="text-sm">
            <strong>Avertissement médical:</strong> Cet outil est destiné à l'aide au diagnostic uniquement. 
            Consultez toujours un professionnel de santé qualifié pour un diagnostic et un traitement appropriés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
