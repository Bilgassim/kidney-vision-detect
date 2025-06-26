
import React from 'react';
import DicomViewer from '@/components/DicomViewer';
import AnalysisResults from '@/components/AnalysisResults';
import { PredictionResponse } from '@/services/api';

interface ViewerSectionProps {
  selectedImage: File | null;
  analysisResult: PredictionResponse | null;
  transformPredictionForAnalysis: (prediction: PredictionResponse) => {
    hasKidneyStone: boolean;
    confidence: number;
    heatmapUrl?: string;
  };
}

const ViewerSection: React.FC<ViewerSectionProps> = ({
  selectedImage,
  analysisResult,
  transformPredictionForAnalysis
}) => {
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
          prediction={transformPredictionForAnalysis(analysisResult)}
          isLoading={false}
        />
      )}
    </div>
  );
};

export default ViewerSection;
