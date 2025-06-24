
import { useState, useRef, useCallback, useEffect } from 'react';
import { ViewerState, Annotation } from '@/types/dicom';

export const useDicomViewer = (onAnnotation?: (annotations: Annotation[]) => void) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [state, setState] = useState<ViewerState>({
    zoom: 1,
    rotation: 0,
    windowLevel: [50],
    windowWidth: [50],
    heatmapOpacity: [50],
    annotationMode: 'none',
    annotations: [],
    isDrawing: false,
    startPos: { x: 0, y: 0 },
    currentAnnotation: null,
  });

  useEffect(() => {
    if (onAnnotation) {
      onAnnotation(state.annotations);
    }
  }, [state.annotations, onAnnotation]);

  const updateCanvas = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Apply zoom and rotation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((state.rotation * Math.PI) / 180);
    ctx.scale(state.zoom, state.zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Apply windowing adjustments
    const brightness = (state.windowLevel[0] - 50) * 2.55;
    const contrast = state.windowWidth[0] / 50;
    
    ctx.filter = `brightness(${100 + brightness}%) contrast(${contrast * 100}%)`;
    
    // Draw the image
    if (imageRef.current.complete) {
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    }

    ctx.restore();
  }, [state.zoom, state.rotation, state.windowLevel, state.windowWidth]);

  const initializeViewer = async (imageFile: File) => {
    try {
      console.log('Initialisation du visualiseur DICOM');
      if (imageFile && canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = 512;
        canvas.height = 512;
        updateCanvas();
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
    }
  };

  const updateState = (updates: Partial<ViewerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return {
    refs: { viewerRef, imageRef, canvasRef },
    state,
    updateState,
    updateCanvas,
    initializeViewer,
  };
};
