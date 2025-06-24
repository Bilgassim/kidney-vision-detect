
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const PerformanceDashboard: React.FC = () => {
  // Données simulées pour les métriques de performance
  const performanceMetrics = {
    accuracy: 94.2,
    precision: 91.8,
    recall: 96.5,
    f1Score: 94.1,
    auc: 0.967,
    processingTime: 2.3, // secondes
    totalAnalyses: 1247,
    successRate: 98.2
  };

  const weeklyData = [
    { day: 'Lun', analyses: 178, accuracy: 94.1, errors: 3 },
    { day: 'Mar', analyses: 196, accuracy: 95.2, errors: 2 },
    { day: 'Mer', analyses: 203, accuracy: 93.8, errors: 5 },
    { day: 'Jeu', analyses: 185, accuracy: 94.7, errors: 4 },
    { day: 'Ven', analyses: 221, accuracy: 95.1, errors: 2 },
    { day: 'Sam', analyses: 156, accuracy: 93.2, errors: 6 },
    { day: 'Dim', analyses: 108, accuracy: 92.9, errors: 8 }
  ];

  const distributionData = [
    { name: 'Calculs détectés', value: 687, color: '#ef4444' },
    { name: 'Pas de calculs', value: 560, color: '#22c55e' }
  ];

  const modelComparison = [
    { model: 'CNN Base', accuracy: 89.2, precision: 87.1, recall: 91.3 },
    { model: 'ResNet-50', accuracy: 92.8, precision: 90.5, recall: 94.2 },
    { model: 'EfficientNet', accuracy: 94.2, precision: 91.8, recall: 96.5 },
    { model: 'Vision Transformer', accuracy: 93.1, precision: 92.3, recall: 93.8 }
  ];

  const getStatusColor = (value: number, threshold: number = 90) => {
    return value >= threshold ? 'text-green-600' : value >= 80 ? 'text-yellow-600' : 'text-red-600';
  };

  const getStatusIcon = (value: number, threshold: number = 90) => {
    return value >= threshold ? CheckCircle : AlertCircle;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Activity className="w-6 h-6 mr-2 text-blue-600" />
          Dashboard de Performance - KidneyVision IA
        </h2>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Précision Globale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getStatusColor(performanceMetrics.accuracy)}`}>
                  {performanceMetrics.accuracy}%
                </span>
                {React.createElement(getStatusIcon(performanceMetrics.accuracy), { 
                  className: `w-5 h-5 ${getStatusColor(performanceMetrics.accuracy)}` 
                })}
              </div>
              <Progress value={performanceMetrics.accuracy} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Précision (Precision)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getStatusColor(performanceMetrics.precision)}`}>
                  {performanceMetrics.precision}%
                </span>
                {React.createElement(getStatusIcon(performanceMetrics.precision), { 
                  className: `w-5 h-5 ${getStatusColor(performanceMetrics.precision)}` 
                })}
              </div>
              <Progress value={performanceMetrics.precision} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rappel (Recall)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getStatusColor(performanceMetrics.recall)}`}>
                  {performanceMetrics.recall}%
                </span>
                {React.createElement(getStatusIcon(performanceMetrics.recall), { 
                  className: `w-5 h-5 ${getStatusColor(performanceMetrics.recall)}` 
                })}
              </div>
              <Progress value={performanceMetrics.recall} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Score F1</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getStatusColor(performanceMetrics.f1Score)}`}>
                  {performanceMetrics.f1Score}%
                </span>
                {React.createElement(getStatusIcon(performanceMetrics.f1Score), { 
                  className: `w-5 h-5 ${getStatusColor(performanceMetrics.f1Score)}` 
                })}
              </div>
              <Progress value={performanceMetrics.f1Score} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Statistiques supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">AUC-ROC</p>
                <p className="text-2xl font-bold text-blue-700">{performanceMetrics.auc}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Temps Moyen</p>
                <p className="text-2xl font-bold text-green-700">{performanceMetrics.processingTime}s</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Analyses Totales</p>
                <p className="text-2xl font-bold text-purple-700">{performanceMetrics.totalAnalyses.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Taux Succès</p>
                <p className="text-2xl font-bold text-orange-700">{performanceMetrics.successRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Évolution hebdomadaire */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution Hebdomadaire</CardTitle>
              <CardDescription>Analyses et précision par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="analyses" fill="#3b82f6" name="Nombre d'analyses" />
                  <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#ef4444" name="Précision %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribution des résultats */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution des Résultats</CardTitle>
              <CardDescription>Répartition des diagnostics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Comparaison des modèles */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Comparaison des Modèles IA</CardTitle>
            <CardDescription>Performance comparative des différents algorithmes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Modèle</th>
                    <th className="text-center p-2">Précision</th>
                    <th className="text-center p-2">Precision</th>
                    <th className="text-center p-2">Recall</th>
                    <th className="text-center p-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {modelComparison.map((model, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{model.model}</td>
                      <td className="p-2 text-center">{model.accuracy}%</td>
                      <td className="p-2 text-center">{model.precision}%</td>
                      <td className="p-2 text-center">{model.recall}%</td>
                      <td className="p-2 text-center">
                        <Badge variant={model.model === 'EfficientNet' ? 'default' : 'secondary'}>
                          {model.model === 'EfficientNet' ? 'Actuel' : 'Test'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
