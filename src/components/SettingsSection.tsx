
import React from 'react';
import { Wifi } from 'lucide-react';
import ApiConnectionTest from '@/components/ApiConnectionTest';

const SettingsSection: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Configuration du Système
      </h3>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Paramètres d'analyse</h4>
          <p className="text-sm text-gray-600">
            Configuration des seuils de détection, optimisation des performances,
            et paramètres d'affichage pour l'environnement clinique.
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Intégration PACS</h4>
          <p className="text-sm text-gray-600">
            Configuration de la connexion aux systèmes PACS hospitaliers
            pour l'import automatique d'images DICOM.
          </p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            Test de Connexion Backend
          </h4>
          <ApiConnectionTest />
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
