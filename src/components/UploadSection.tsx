
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ApiConnectionTest from '@/components/ApiConnectionTest';
import ClinicalInfo from '@/components/ClinicalInfo';
import ImageUpload from '@/components/ImageUpload';
import AnalysisResults from '@/components/AnalysisResults';
import { PredictionResponse } from '@/services/api';

interface UploadSectionProps {
  selectedImage: File | null;
  isAnalyzing: boolean;
  analysisResult: PredictionResponse | null;
  onImageSelect: (file: File) => void;
  onClearImage: () => void;
  onAnalyze: () => void;
  transformPredictionForAnalysis: (prediction: PredictionResponse) => {
    hasKidneyStone: boolean;
    confidence: number;
    heatmapUrl?: string;
  };
}

const UploadSection: React.FC<UploadSectionProps> = ({
  selectedImage,
  isAnalyzing,
  analysisResult,
  onImageSelect,
  onClearImage,
  onAnalyze,
  transformPredictionForAnalysis
}) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <ApiConnectionTest />
      </div>

      <ClinicalInfo />

      <ImageUpload
        onImageSelect={onImageSelect}
        selectedImage={selectedImage}
        onClearImage={onClearImage}
        isAnalyzing={isAnalyzing}
      />

      {selectedImage && !analysisResult && (
        <div className="flex justify-center">
          <Button
            onClick={onAnalyze}
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
          prediction={analysisResult ? transformPredictionForAnalysis(analysisResult) : { hasKidneyStone: false, confidence: 0 }}
          isLoading={isAnalyzing}
        />
      )}
    </div>
  );
};

export default UploadSection;
