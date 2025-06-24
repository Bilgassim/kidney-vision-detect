
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, RotateCw, Square, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DicomViewerProps {
  imageFile?: File;
  heatmapData?: any;
  onAnnotation?: (annotations: any[]) => void;
}

const DicomViewer: React.FC<DicomViewerProps> = ({ 
  imageFile, 
  heatmapData, 
  onAnnotation 
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [heatmapOpacity, setHeatmapOpacity] = useState([50]);
  const [annotationMode, setAnnotationMode] = useState<'none' | 'rectangle' | 'circle'>('none');
  const [windowLevel, setWindowLevel] = useState([50]);
  const [windowWidth, setWindowWidth] = useState([50]);
  const [annotations, setAnnotations] = useState<any[]>([]);

  useEffect(() => {
    if (viewerRef.current && imageFile) {
      // Initialisation de Cornerstone.js
      initializeCornerstone();
    }
  }, [imageFile]);

  const initializeCornerstone = async () => {
    try {
      // Configuration de Cornerstone pour l'affichage DICOM
      console.log('Initialisation de Cornerstone.js pour la visualisation DICOM');
      
      // Simulation de l'affichage DICOM - en production, utiliser cornerstone-core
      if (viewerRef.current) {
        viewerRef.current.style.background = '#000';
        viewerRef.current.style.border = '2px solid #333';
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Cornerstone:', error);
    }
  };

  const handleZoomIn = () => {
    console.log('Zoom avant sur l\'image DICOM');
  };

  const handleZoomOut = () => {
    console.log('Zoom arrière sur l\'image DICOM');
  };

  const handleRotate = () => {
    console.log('Rotation de l\'image DICOM');
  };

  const handleAnnotationModeChange = (mode: 'none' | 'rectangle' | 'circle') => {
    setAnnotationMode(mode);
    console.log(`Mode d'annotation changé vers: ${mode}`);
  };

  const handleWindowLevelChange = (value: number[]) => {
    setWindowLevel(value);
    console.log('Ajustement du niveau de fenêtre:', value[0]);
  };

  const handleWindowWidthChange = (value: number[]) => {
    setWindowWidth(value);
    console.log('Ajustement de la largeur de fenêtre:', value[0]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Visualiseur DICOM - Interface Clinique
        </h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="flex items-center space-x-1"
          >
            <ZoomIn className="w-4 h-4" />
            <span>Zoom +</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="flex items-center space-x-1"
          >
            <ZoomOut className="w-4 h-4" />
            <span>Zoom -</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotate}
            className="flex items-center space-x-1"
          >
            <RotateCw className="w-4 h-4" />
            <span>Rotation</span>
          </Button>
        </div>
      </div>

      {/* Zone de visualisation DICOM */}
      <div 
        ref={viewerRef}
        className="w-full h-96 bg-black rounded-lg relative overflow-hidden cursor-crosshair"
        style={{
          background: imageFile ? `url(${URL.createObjectURL(imageFile)})` : '#000',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay pour les cartes de chaleur */}
        {heatmapData && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              opacity: heatmapOpacity[0] / 100,
              background: 'linear-gradient(45deg, rgba(255,0,0,0.3) 0%, rgba(255,255,0,0.3) 50%, rgba(0,255,0,0.3) 100%)'
            }}
          />
        )}
        
        {/* Annotations */}
        {annotations.map((annotation, index) => (
          <div
            key={index}
            className="absolute border-2 border-yellow-400"
            style={{
              left: annotation.x,
              top: annotation.y,
              width: annotation.width,
              height: annotation.height,
            }}
          />
        ))}
        
        {!imageFile && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Chargez une image DICOM pour commencer la visualisation
          </div>
        )}
      </div>

      {/* Contrôles de fenêtrage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Niveau de fenêtre (Contraste): {windowLevel[0]}
          </label>
          <Slider
            value={windowLevel}
            onValueChange={handleWindowLevelChange}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Largeur de fenêtre (Luminosité): {windowWidth[0]}
          </label>
          <Slider
            value={windowWidth}
            onValueChange={handleWindowWidthChange}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Contrôles des cartes de chaleur */}
      {heatmapData && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Opacité des cartes de chaleur: {heatmapOpacity[0]}%
          </label>
          <Slider
            value={heatmapOpacity}
            onValueChange={setHeatmapOpacity}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>
      )}

      {/* Outils d'annotation */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Outils d'annotation manuelle
        </h4>
        <div className="flex space-x-2">
          <Button
            variant={annotationMode === 'none' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleAnnotationModeChange('none')}
          >
            Désactiver
          </Button>
          <Button
            variant={annotationMode === 'rectangle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleAnnotationModeChange('rectangle')}
            className="flex items-center space-x-1"
          >
            <Square className="w-4 h-4" />
            <span>Rectangle</span>
          </Button>
          <Button
            variant={annotationMode === 'circle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleAnnotationModeChange('circle')}
            className="flex items-center space-x-1"
          >
            <Circle className="w-4 h-4" />
            <span>Cercle</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DicomViewer;
