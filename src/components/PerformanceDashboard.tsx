
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, Target, TrendingUp, CheckCircle } from 'lucide-react';

interface PerformanceMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  accuracy: number;
}

interface PerformanceDashboardProps {
  metrics?: PerformanceMetrics;
  trainingData?: any[];
  validationData?: any[];
  testData?: any[];
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ 
  metrics = {
    precision: 0.92,
    recall: 0.89,
    f1Score: 0.90,
    auc: 0.95,
    accuracy: 0.91
  },
  trainingData,
  validationData,
  testData
}) => {
  const performanceData = [
    { name: 'Précision', value: metrics.precision * 100, color: '#3B82F6' },
    { name: 'Rappel', value: metrics.recall * 100, color: '#10B981' },
    { name: 'F1-Score', value: metrics.f1Score * 100, color: '#F59E0B' },
    { name: 'AUC', value: metrics.auc * 100, color: '#EF4444' },
    { name: 'Exactitude', value: metrics.accuracy * 100, color: '#8B5CF6' }
  ];

  const evolutionData = [
    { epoch: 1, training: 0.75, validation: 0.73, test: 0.71 },
    { epoch: 5, training: 0.85, validation: 0.82, test: 0.80 },
    { epoch: 10, training: 0.90, validation: 0.87, test: 0.85 },
    { epoch: 15, training: 0.93, validation: 0.90, test: 0.89 },
    { epoch: 20, training: 0.95, validation: 0.92, test: 0.91 }
  ];

  const MetricCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
          <Activity className="w-6 h-6 text-blue-600" />
          <span>Dashboard de Performance - Métriques en Temps Réel</span>
        </h2>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={Target}
            title="Précision"
            value={`${(metrics.precision * 100).toFixed(1)}%`}
            subtitle="Vrais positifs / (VP + FP)"
            color="blue"
          />
          <MetricCard
            icon={CheckCircle}
            title="Rappel"
            value={`${(metrics.recall * 100).toFixed(1)}%`}
            subtitle="Vrais positifs / (VP + FN)"
            color="green"
          />
          <MetricCard
            icon={TrendingUp}
            title="F1-Score"
            value={`${(metrics.f1Score * 100).toFixed(1)}%`}
            subtitle="Moyenne harmonique P/R"
            color="orange"
          />
          <MetricCard
            icon={Activity}
            title="AUC-ROC"
            value={`${(metrics.auc * 100).toFixed(1)}%`}
            subtitle="Aire sous la courbe ROC"
            color="purple"
          />
        </div>

        {/* Graphiques de performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique en barres des métriques */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Métriques de Performance Actuelles
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Évolution des performances */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Évolution des Performances par Époque
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis domain={[0.6, 1]} />
                <Tooltip formatter={(value) => [`${(value * 100).toFixed(1)}%`, '']} />
                <Line 
                  type="monotone" 
                  dataKey="training" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Entraînement"
                />
                <Line 
                  type="monotone" 
                  dataKey="validation" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Validation"
                />
                <Line 
                  type="monotone" 
                  dataKey="test" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Test"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Informations complémentaires */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">
            Évaluation Clinique
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Sensibilité:</span>
              <span className="ml-2 text-blue-900">{(metrics.recall * 100).toFixed(1)}%</span>
              <p className="text-xs text-blue-600 mt-1">
                Capacité à détecter les vrais cas positifs
              </p>
            </div>
            <div>
              <span className="font-medium text-blue-700">Spécificité:</span>
              <span className="ml-2 text-blue-900">{((1 - (1 - metrics.precision)) * 100).toFixed(1)}%</span>
              <p className="text-xs text-blue-600 mt-1">
                Capacité à éviter les faux positifs
              </p>
            </div>
            <div>
              <span className="font-medium text-blue-700">Exactitude globale:</span>
              <span className="ml-2 text-blue-900">{(metrics.accuracy * 100).toFixed(1)}%</span>
              <p className="text-xs text-blue-600 mt-1">
                Performance générale du modèle
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
