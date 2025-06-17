
import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClearImage: () => void;
  isAnalyzing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  onClearImage,
  isAnalyzing
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageSelect(imageFile);
    }
  }, [onImageSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!selectedImage ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50",
            isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300",
            isAnalyzing && "pointer-events-none opacity-50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Chargez une image médicale
              </h3>
              <p className="text-gray-500 mb-4">
                Glissez-déposez votre image ou cliquez pour sélectionner
              </p>
              <p className="text-sm text-gray-400">
                Formats supportés : JPEG, PNG, WebP
              </p>
            </div>
          </div>
          
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isAnalyzing}
          />
        </div>
      ) : (
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Image sélectionnée"
              className="w-full h-64 object-cover"
            />
            <button
              onClick={onClearImage}
              disabled={isAnalyzing}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors shadow-lg disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 bg-gray-50">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ImageIcon className="w-4 h-4" />
              <span>{selectedImage.name}</span>
              <span className="text-gray-400">
                ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
