
import React, { useEffect } from 'react';
import { DicomViewerProps, Annotation } from '@/types/dicom';
import { useDicomViewer } from '@/hooks/useDicomViewer';
import DicomViewerControls from './DicomViewerControls';
import AnnotationTools from './AnnotationTools';
import DicomCanvas from './DicomCanvas';

const DicomViewer: React.FC<DicomViewerProps> = ({ 
  imageFile, 
  heatmapData, 
  onAnnotation 
}) => {
  const { refs, state, updateState, updateCanvas, initializeViewer } = useDicomViewer(onAnnotation);

  useEffect(() => {
    if (refs.viewerRef.current && imageFile) {
      initializeViewer(imageFile);
    }
  }, [imageFile]);

  useEffect(() => {
    updateCanvas();
  }, [updateCanvas]);

  const handleZoomIn = () => {
    updateState({ zoom: Math.min(state.zoom * 1.2, 5) });
    console.log('Zoom avant appliqué');
  };

  const handleZoomOut = () => {
    updateState({ zoom: Math.max(state.zoom / 1.2, 0.1) });
    console.log('Zoom arrière appliqué');
  };

  const handleRotate = () => {
    updateState({ rotation: (state.rotation + 90) % 360 });
    console.log('Rotation appliquée');
  };

  const handleAnnotationModeChange = (mode: 'none' | 'rectangle' | 'circle') => {
    updateState({ annotationMode: mode });
    console.log(`Mode d'annotation changé vers: ${mode}`);
  };

  const handleWindowLevelChange = (value: number[]) => {
    updateState({ windowLevel: value });
    console.log('Ajustement du niveau de fenêtre:', value[0]);
  };

  const handleWindowWidthChange = (value: number[]) => {
    updateState({ windowWidth: value });
    console.log('Ajustement de la largeur de fenêtre:', value[0]);
  };

  const handleHeatmapOpacityChange = (value: number[]) => {
    updateState({ heatmapOpacity: value });
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!refs.canvasRef.current) return { x: 0, y: 0 };
    const rect = refs.canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (state.annotationMode === 'none') return;
    
    const pos = getMousePos(e);
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: state.annotationMode,
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0
    };
    
    updateState({ 
      isDrawing: true, 
      startPos: pos, 
      currentAnnotation: newAnnotation 
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!state.isDrawing || !state.currentAnnotation || state.annotationMode === 'none') return;
    
    const pos = getMousePos(e);
    const updatedAnnotation = {
      ...state.currentAnnotation,
      width: pos.x - state.startPos.x,
      height: pos.y - state.startPos.y
    };
    updateState({ currentAnnotation: updatedAnnotation });
  };

  const handleMouseUp = () => {
    if (!state.isDrawing || !state.currentAnnotation) return;
    
    if (Math.abs(state.currentAnnotation.width) > 10 && Math.abs(state.currentAnnotation.height) > 10) {
      updateState({ 
        annotations: [...state.annotations, state.currentAnnotation],
        isDrawing: false,
        currentAnnotation: null
      });
    } else {
      updateState({ 
        isDrawing: false,
        currentAnnotation: null
      });
    }
  };

  const handleClearAnnotations = () => {
    updateState({ annotations: [] });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <DicomViewerControls
        state={state}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRotate={handleRotate}
        onWindowLevelChange={handleWindowLevelChange}
        onWindowWidthChange={handleWindowWidthChange}
        onHeatmapOpacityChange={handleHeatmapOpacityChange}
        heatmapData={heatmapData}
      />

      <DicomCanvas
        canvasRef={refs.canvasRef}
        imageRef={refs.imageRef}
        viewerRef={refs.viewerRef}
        imageFile={imageFile}
        heatmapData={heatmapData}
        state={state}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onImageLoad={updateCanvas}
      />

      <AnnotationTools
        state={state}
        onAnnotationModeChange={handleAnnotationModeChange}
        onClearAnnotations={handleClearAnnotations}
      />
    </div>
  );
};

export default DicomViewer;
