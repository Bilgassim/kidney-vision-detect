
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { ViewerState } from '@/types/dicom';

interface DicomViewerControlsProps {
  state: ViewerState;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onWindowLevelChange: (value: number[]) => void;
  onWindowWidthChange: (value: number[]) => void;
  onHeatmapOpacityChange: (value: number[]) => void;
  heatmapData?: any;
}

const DicomViewerControls: React.FC<DicomViewerControlsProps> = ({
  state,
  onZoomIn,
  onZoomOut,
  onRotate,
  onWindowLevelChange,
  onWindowWidthChange,
  onHeatmapOpacityChange,
  heatmapData,
}) => {
  return (
    <div className="space-y-4">
      {/* Header with main controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Visualiseur DICOM - Interface Clinique
        </h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
            className="flex items-center space-x-1"
          >
            <ZoomIn className="w-4 h-4" />
            <span>Zoom +</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
            className="flex items-center space-x-1"
          >
            <ZoomOut className="w-4 h-4" />
            <span>Zoom -</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRotate}
            className="flex items-center space-x-1"
          >
            <RotateCw className="w-4 h-4" />
            <span>Rotation</span>
          </Button>
        </div>
      </div>

      {/* Windowing controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Niveau de fenêtre (Contraste): {state.windowLevel[0]}
          </label>
          <Slider
            value={state.windowLevel}
            onValueChange={onWindowLevelChange}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Largeur de fenêtre (Luminosité): {state.windowWidth[0]}
          </label>
          <Slider
            value={state.windowWidth}
            onValueChange={onWindowWidthChange}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Heatmap controls */}
      {heatmapData && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Opacité des cartes de chaleur: {state.heatmapOpacity[0]}%
          </label>
          <Slider
            value={state.heatmapOpacity}
            onValueChange={onHeatmapOpacityChange}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default DicomViewerControls;
