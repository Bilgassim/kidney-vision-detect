
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, RotateCw, Square, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DicomViewerProps {
  imageFile?: File;
  heatmapData?: any;
  onAnnotation?: (annotations: any[]) => void;
}

interface Annotation {
  id: string;
  type: 'rectangle' | 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
}

const DicomViewer: React.FC<DicomViewerProps> = ({ 
  imageFile, 
  heatmapData, 
  onAnnotation 
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [heatmapOpacity, setHeatmapOpacity] = useState([50]);
  const [annotationMode, setAnnotationMode] = useState<'none' | 'rectangle' | 'circle'>('none');
  const [windowLevel, setWindowLevel] = useState([50]);
  const [windowWidth, setWindowWidth] = useState([50]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);

  useEffect(() => {
    if (viewerRef.current && imageFile) {
      initializeViewer();
    }
  }, [imageFile]);

  useEffect(() => {
    if (onAnnotation) {
      onAnnotation(annotations);
    }
  }, [annotations, onAnnotation]);

  const initializeViewer = async () => {
    try {
      console.log('Initialisation du visualiseur DICOM');
      if (imageFile && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx && imageRef.current) {
          canvas.width = 512;
          canvas.height = 512;
          updateCanvas();
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
    }
  };

  const updateCanvas = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Appliquer le zoom et la rotation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Appliquer les ajustements de fenêtrage (simulation)
    const brightness = (windowLevel[0] - 50) * 2.55;
    const contrast = windowWidth[0] / 50;
    
    ctx.filter = `brightness(${100 + brightness}%) contrast(${contrast * 100}%)`;
    
    // Dessiner l'image
    if (imageRef.current.complete) {
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    }

    ctx.restore();
  }, [zoom, rotation, windowLevel, windowWidth]);

  useEffect(() => {
    updateCanvas();
  }, [updateCanvas]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
    console.log('Zoom avant appliqué');
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
    console.log('Zoom arrière appliqué');
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
    console.log('Rotation appliquée');
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

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (annotationMode === 'none') return;
    
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);
    
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: annotationMode,
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0
    };
    setCurrentAnnotation(newAnnotation);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAnnotation || annotationMode === 'none') return;
    
    const pos = getMousePos(e);
    const updatedAnnotation = {
      ...currentAnnotation,
      width: pos.x - startPos.x,
      height: pos.y - startPos.y
    };
    setCurrentAnnotation(updatedAnnotation);
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentAnnotation) return;
    
    if (Math.abs(currentAnnotation.width) > 10 && Math.abs(currentAnnotation.height) > 10) {
      setAnnotations(prev => [...prev, currentAnnotation]);
    }
    
    setIsDrawing(false);
    setCurrentAnnotation(null);
  };

  const drawAnnotations = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dessiner les annotations existantes
    annotations.forEach(annotation => {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      if (annotation.type === 'rectangle') {
        ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height);
      } else if (annotation.type === 'circle') {
        const centerX = annotation.x + annotation.width / 2;
        const centerY = annotation.y + annotation.height / 2;
        const radius = Math.sqrt(annotation.width * annotation.width + annotation.height * annotation.height) / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

    // Dessiner l'annotation en cours
    if (currentAnnotation && isDrawing) {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      
      if (currentAnnotation.type === 'rectangle') {
        ctx.strokeRect(currentAnnotation.x, currentAnnotation.y, currentAnnotation.width, currentAnnotation.height);
      } else if (currentAnnotation.type === 'circle') {
        const centerX = currentAnnotation.x + currentAnnotation.width / 2;
        const centerY = currentAnnotation.y + currentAnnotation.height / 2;
        const radius = Math.sqrt(currentAnnotation.width * currentAnnotation.width + currentAnnotation.height * currentAnnotation.height) / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    drawAnnotations();
  }, [annotations, currentAnnotation, isDrawing]);

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
      <div className="relative">
        <div 
          ref={viewerRef}
          className="w-full h-96 bg-black rounded-lg relative overflow-hidden"
        >
          {imageFile && (
            <>
              <img
                ref={imageRef}
                src={URL.createObjectURL(imageFile)}
                alt="Image DICOM"
                className="hidden"
                onLoad={updateCanvas}
              />
              <canvas
                ref={canvasRef}
                className={cn(
                  "absolute inset-0 w-full h-full object-contain",
                  annotationMode !== 'none' ? 'cursor-crosshair' : 'cursor-default'
                )}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </>
          )}
          
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
          
          {!imageFile && (
            <div className="flex items-center justify-center h-full text-gray-400">
              Chargez une image DICOM pour commencer la visualisation
            </div>
          )}
        </div>
        
        {/* Informations de zoom et rotation */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
          Zoom: {(zoom * 100).toFixed(0)}% | Rotation: {rotation}°
        </div>
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
        <div className="flex space-x-2 mb-3">
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
          {annotations.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setAnnotations([])}
            >
              Effacer tout
            </Button>
          )}
        </div>
        {annotations.length > 0 && (
          <p className="text-xs text-gray-500">
            {annotations.length} annotation(s) créée(s)
          </p>
        )}
      </div>
    </div>
  );
};

export default DicomViewer;
