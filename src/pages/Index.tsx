
import React, { useState } from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import AnalysisResults from '@/components/AnalysisResults';
import DicomViewer from '@/components/DicomViewer';
import PerformanceDashboard from '@/components/PerformanceDashboard';
import ClinicalNavigation from '@/components/ClinicalNavigation';
import ApiConnectionTest from '@/components/ApiConnectionTest';
import { kidneyStoneAPI, PredictionResponse } from '@/services/api';
import { Button } from '@/components/ui/button';
import { RefreshCw, Info, Stethoscope, Wifi } from 'lucide-react';

const Index: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PredictionResponse | null>(null);
  const [activeTab, setActiveTab] = useState('upload');

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
      
      // Adapter le message selon la prédiction
      const predictionText = result.prediction === 'stone' ? 'Calcul rénal détecté' : 'Pas de calcul rénal détecté';
      toast.success(`Analyse terminée: ${predictionText} (${(result.confidence * 100).toFixed(1)}% de confiance)`);
      console.log('Résultat de l\'analyse:', result);
      
      // Basculer automatiquement vers le visualiseur après l'analyse
      setActiveTab('viewer');
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
    setActiveTab('upload');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <div className="space-y-8">
            {/* Test de connexion API */}
            <div className="flex justify-center">
              <ApiConnectionTest />
            </div>

            {/* Section d'information clinique */}
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 shadow-sm border border-blue-100">
              <div className="flex items-start space-x-3">
                <Stethoscope className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Interface Clinique KidneyVision - Aide au Diagnostic
                  </h2>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• <strong>Visualisation DICOM:</strong> Navigation fluide entre les coupes CT avec contrôles de fenêtrage</li>
                    <li>• <strong>Cartes de chaleur:</strong> Superposition paramétrable des zones d'attention du modèle</li>
                    <li>• <strong>Annotation manuelle:</strong> Outils de validation et correction pour les experts</li>
                    <li>• <strong>Dashboard temps réel:</strong> Métriques de performance (précision, rappel, F1-score, AUC)</li>
                    <li>• <strong>Compatibilité hospitalière:</strong> Interface ergonomique adaptée aux systèmes d'information cliniques</li>
                  </ul>
                </div>
              </div>
            </div>

            <ImageUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onClearImage={handleClearImage}
              isAnalyzing={isAnalyzing}
            />

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
                      Analyse IA en cours...
                    </>
                  ) : (
                    'Analyser avec IA médicale'
                  )}
                </Button>
              </div>
            )}

            {(analysisResult || isAnalyzing) && (
              <AnalysisResults
                prediction={analysisResult || { hasKidneyStone: false, confidence: 0 }}
                isLoading={isAnalyzing}
              />
            )}
          </div>
        );

      case 'viewer':
        return (
          <div className="space-y-6">
            <DicomViewer 
              imageFile={selectedImage}
              heatmapData={analysisResult}
              onAnnotation={(annotations) => {
                console.log('Nouvelles annotations:', annotations);
              }}
            />
            {analysisResult && (
              <AnalysisResults
                prediction={analysisResult}
                isLoading={false}
              />
            )}
          </div>
        );

      case 'dashboard':
        return <PerformanceDashboard />;

      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Configuration du Système
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Paramètres d'analyse</h4>
                <p className="text-sm text-gray-600">
                  Configuration des seuils de détection, optimisation des performances,
                  et paramètres d'affichage pour l'environnement clinique.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Intégration PACS</h4>
                <p className="text-sm text-gray-600">
                  Configuration de la connexion aux systèmes PACS hospitaliers
                  pour l'import automatique d'images DICOM.
                </p>
              </div>
              
              {/* Test de connexion dans les paramètres */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  Test de Connexion Backend
                </h4>
                <ApiConnectionTest />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <ClinicalNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        {renderTabContent()}

        {analysisResult && activeTab !== 'upload' && (
          <div className="flex justify-center mt-8">
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

      {/* Footer médical */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="text-sm mb-2">
            <strong>Interface Clinique KidneyVision</strong> - Système d'aide au diagnostic par intelligence artificielle
          </p>
          <p className="text-xs">
            <strong>Avertissement médical:</strong> Cet outil est destiné à l'aide au diagnostic uniquement. 
            Les résultats doivent être interprétés par un professionnel de santé qualifié. 
            Compatible avec les standards DICOM et les systèmes d'information hospitaliers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
