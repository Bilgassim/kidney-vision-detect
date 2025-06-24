
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ViewerState, Annotation } from '@/types/dicom';

interface DicomCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  imageRef: React.RefObject<HTMLImageElement>;
  viewerRef: React.RefObject<HTMLDivElement>;
  imageFile?: File;
  heatmapData?: any;
  state: ViewerState;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onImageLoad: () => void;
}

const DicomCanvas: React.FC<DicomCanvasProps> = ({
  canvasRef,
  imageRef,
  viewerRef,
  imageFile,
  heatmapData,
  state,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onImageLoad,
}) => {
  const drawAnnotations = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw existing annotations
    state.annotations.forEach(annotation => {
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

    // Draw current annotation being drawn
    if (state.currentAnnotation && state.isDrawing) {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      
      if (state.currentAnnotation.type === 'rectangle') {
        ctx.strokeRect(state.currentAnnotation.x, state.currentAnnotation.y, state.currentAnnotation.width, state.currentAnnotation.height);
      } else if (state.currentAnnotation.type === 'circle') {
        const centerX = state.currentAnnotation.x + state.currentAnnotation.width / 2;
        const centerY = state.currentAnnotation.y + state.currentAnnotation.height / 2;
        const radius = Math.sqrt(state.currentAnnotation.width * state.currentAnnotation.width + state.currentAnnotation.height * state.currentAnnotation.height) / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    drawAnnotations();
  }, [state.annotations, state.currentAnnotation, state.isDrawing]);

  return (
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
              onLoad={onImageLoad}
            />
            <canvas
              ref={canvasRef}
              className={cn(
                "absolute inset-0 w-full h-full object-contain",
                state.annotationMode !== 'none' ? 'cursor-crosshair' : 'cursor-default'
              )}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            />
          </>
        )}
        
        {/* Heatmap overlay */}
        {heatmapData && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              opacity: state.heatmapOpacity[0] / 100,
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
      
      {/* Zoom and rotation info */}
      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
        Zoom: {(state.zoom * 100).toFixed(0)}% | Rotation: {state.rotation}°
      </div>
    </div>
  );
};

export default DicomCanvas;
