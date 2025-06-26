
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ClinicalNavigation from '@/components/ClinicalNavigation';
import PerformanceDashboard from '@/components/PerformanceDashboard';
import UploadSection from '@/components/UploadSection';
import ViewerSection from '@/components/ViewerSection';
import SettingsSection from '@/components/SettingsSection';
import Footer from '@/components/Footer';
import { useImageAnalysis } from '@/hooks/useImageAnalysis';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  
  const {
    selectedImage,
    isAnalyzing,
    analysisResult,
    handleImageSelect,
    handleClearImage,
    handleAnalyze,
    handleNewAnalysis,
    transformPredictionForAnalysis
  } = useImageAnalysis(() => {
    // Basculer automatiquement vers le visualiseur après l'analyse
    setActiveTab('viewer');
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <UploadSection
            selectedImage={selectedImage}
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            onImageSelect={handleImageSelect}
            onClearImage={handleClearImage}
            onAnalyze={handleAnalyze}
            transformPredictionForAnalysis={transformPredictionForAnalysis}
          />
        );

      case 'viewer':
        return (
          <ViewerSection
            selectedImage={selectedImage}
            analysisResult={analysisResult}
            transformPredictionForAnalysis={transformPredictionForAnalysis}
          />
        );

      case 'dashboard':
        return <PerformanceDashboard />;

      case 'settings':
        return <SettingsSection />;

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

      <Footer />
    </div>
  );
};

export default Index;
