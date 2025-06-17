
import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisResultsProps {
  prediction: {
    hasKidneyStone: boolean;
    confidence: number;
    heatmapUrl?: string;
  };
  isLoading: boolean;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ prediction, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center space-x-3">
          <Activity className="w-6 h-6 text-blue-500 animate-pulse" />
          <span className="text-lg font-medium text-gray-700">
            Analyse en cours...
          </span>
        </div>
        <div className="mt-4 bg-gray-100 rounded-lg h-2">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  const getResultIcon = () => {
    if (prediction.hasKidneyStone) {
      return prediction.confidence > 0.8 ? 
        <XCircle className="w-8 h-8 text-red-500" /> :
        <AlertTriangle className="w-8 h-8 text-orange-500" />;
    }
    return <CheckCircle className="w-8 h-8 text-green-500" />;
  };

  const getResultText = () => {
    if (prediction.hasKidneyStone) {
      return prediction.confidence > 0.8 ? 
        "Calcul rénal détecté" : 
        "Calcul rénal probable";
    }
    return "Aucun calcul rénal détecté";
  };

  const getResultDescription = () => {
    if (prediction.hasKidneyStone) {
      return prediction.confidence > 0.8 ? 
        "L'analyse indique la présence d'un calcul rénal avec une forte probabilité." :
        "L'analyse suggère la présence possible d'un calcul rénal.";
    }
    return "L'analyse n'a pas détecté de calcul rénal dans cette image.";
  };

  const getConfidenceColor = () => {
    if (prediction.confidence > 0.8) return "text-red-600";
    if (prediction.confidence > 0.6) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Résultats de l'analyse */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          {getResultIcon()}
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {getResultText()}
            </h3>
            <p className="text-gray-600">
              {getResultDescription()}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Niveau de confiance
            </span>
            <span className={cn("text-sm font-semibold", getConfidenceColor())}>
              {(prediction.confidence * 100).toFixed(1)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={cn(
                "h-3 rounded-full transition-all duration-1000 ease-out",
                prediction.hasKidneyStone ? 
                  "bg-gradient-to-r from-orange-500 to-red-500" :
                  "bg-gradient-to-r from-green-400 to-green-600"
              )}
              style={{ width: `${prediction.confidence * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Carte de chaleur */}
      {prediction.heatmapUrl && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span>Carte de chaleur - Zones d'intérêt</span>
          </h3>
          <div className="rounded-lg overflow-hidden bg-gray-100">
            <img
              src={prediction.heatmapUrl}
              alt="Carte de chaleur"
              className="w-full h-auto"
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Les zones en rouge indiquent les régions où l'algorithme a détecté une probabilité élevée de calcul rénal.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
