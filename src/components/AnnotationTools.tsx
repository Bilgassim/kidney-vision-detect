
import React from 'react';
import { Button } from '@/components/ui/button';
import { Square, Circle } from 'lucide-react';
import { ViewerState } from '@/types/dicom';

interface AnnotationToolsProps {
  state: ViewerState;
  onAnnotationModeChange: (mode: 'none' | 'rectangle' | 'circle') => void;
  onClearAnnotations: () => void;
}

const AnnotationTools: React.FC<AnnotationToolsProps> = ({
  state,
  onAnnotationModeChange,
  onClearAnnotations,
}) => {
  return (
    <div className="border-t pt-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        Outils d'annotation manuelle
      </h4>
      <div className="flex space-x-2 mb-3">
        <Button
          variant={state.annotationMode === 'none' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onAnnotationModeChange('none')}
        >
          Désactiver
        </Button>
        <Button
          variant={state.annotationMode === 'rectangle' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onAnnotationModeChange('rectangle')}
          className="flex items-center space-x-1"
        >
          <Square className="w-4 h-4" />
          <span>Rectangle</span>
        </Button>
        <Button
          variant={state.annotationMode === 'circle' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onAnnotationModeChange('circle')}
          className="flex items-center space-x-1"
        >
          <Circle className="w-4 h-4" />
          <span>Cercle</span>
        </Button>
        {state.annotations.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onClearAnnotations}
          >
            Effacer tout
          </Button>
        )}
      </div>
      {state.annotations.length > 0 && (
        <p className="text-xs text-gray-500">
          {state.annotations.length} annotation(s) créée(s)
        </p>
      )}
    </div>
  );
};

export default AnnotationTools;
