
export interface Annotation {
  id: string;
  type: 'rectangle' | 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DicomViewerProps {
  imageFile?: File;
  heatmapData?: any;
  onAnnotation?: (annotations: Annotation[]) => void;
}

export interface ViewerState {
  zoom: number;
  rotation: number;
  windowLevel: number[];
  windowWidth: number[];
  heatmapOpacity: number[];
  annotationMode: 'none' | 'rectangle' | 'circle';
  annotations: Annotation[];
  isDrawing: boolean;
  startPos: { x: number; y: number };
  currentAnnotation: Annotation | null;
}
