
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p className="text-sm mb-2">
          <strong>Interface Clinique KidneyVision</strong> - Système d'aide au diagnostic par intelligence artificielle
        </p>
        <p className="text-xs">
          <strong>Avertissement médical:</strong> Cet outil est destiné à l'aide au diagnostic uniquement. 
          Les résultats doivent être interprétés par un professionnel de santé qualifié. 
          Compatible avec les standards DICOM et les systèmes d'information hospitaliers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
