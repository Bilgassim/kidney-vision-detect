
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Image, BarChart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClinicalNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ClinicalNavigation: React.FC<ClinicalNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const tabs = [
    {
      id: 'upload',
      label: 'Analyse d\'Image',
      icon: Image,
      description: 'Upload et analyse d\'images médicales'
    },
    {
      id: 'viewer',
      label: 'Visualiseur DICOM',
      icon: Activity,
      description: 'Visualisation interactive avec cartes de chaleur'
    },
    {
      id: 'dashboard',
      label: 'Performance',
      icon: BarChart,
      description: 'Métriques et dashboard de performance'
    },
    {
      id: 'settings',
      label: 'Configuration',
      icon: Settings,
      description: 'Paramètres et configuration du système'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Interface Clinique - Navigation
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              className={cn(
                'h-auto p-4 flex flex-col items-center space-y-2 text-center',
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-blue-50 hover:border-blue-300'
              )}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="w-6 h-6" />
              <div>
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs opacity-80">{tab.description}</div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ClinicalNavigation;
