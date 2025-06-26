
import React from 'react';
import { Stethoscope } from 'lucide-react';

const ClinicalInfo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 shadow-sm border border-blue-100">
      <div className="flex items-start space-x-3">
        <Stethoscope className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Interface Clinique KidneyVision - Aide au Diagnostic
          </h2>
          <ul className="text-gray-600 space-y-1 text-sm">
            <li>• <strong>Visualisation DICOM:</strong> Navigation fluide entre les coupes CT avec contrôles de fenêtrage</li>
            <li>• <strong>Cartes de chaleur:</strong> Superposition paramétrable des zones d'attention du modèle</li>
            <li>• <strong>Annotation manuelle:</strong> Outils de validation et correction pour les experts</li>
            <li>• <strong>Dashboard temps réel:</strong> Métriques de performance (précision, rappel, F1-score, AUC)</li>
            <li>• <strong>Compatibilité hospitalière:</strong> Interface ergonomique adaptée aux systèmes d'information cliniques</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClinicalInfo;
