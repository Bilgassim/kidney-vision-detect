
import React from 'react';
import { Activity, Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 rounded-full p-2">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">KidneyVision</h1>
              <p className="text-blue-100 text-sm">Détection intelligente des calculs rénaux</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-2 text-blue-100">
          <Shield className="w-4 h-4" />
          <span className="text-sm">
            Technologie d'IA médicale pour l'analyse d'images radiologiques
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
