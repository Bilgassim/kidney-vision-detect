
import React, { useState, useEffect } from 'react';
import { kidneyStoneAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

const ApiConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    setApiUrl(import.meta.env.VITE_API_URL || 'http://localhost:8000');
    // Test automatique au montage du composant
    testConnection();
  }, []);

  const testConnection = async () => {
    setConnectionStatus('testing');
    setStatusMessage('Test de connexion en cours...');

    try {
      const result = await kidneyStoneAPI.healthCheck();
      
      if (result.status === 'success') {
        setConnectionStatus('success');
        setStatusMessage(result.message);
      } else {
        setConnectionStatus('error');
        setStatusMessage(result.message);
      }
    } catch (error) {
      setConnectionStatus('error');
      setStatusMessage(`Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'testing':
        return <Badge variant="secondary">Test en cours...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-500">Connecté</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return <Badge variant="outline">Non testé</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {getStatusIcon()}
          État de la Connexion API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">URL du Backend:</p>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{apiUrl}</code>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Statut:</span>
          {getStatusBadge()}
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Message:</p>
          <p className="text-sm">{statusMessage}</p>
        </div>

        <Button 
          onClick={testConnection} 
          disabled={connectionStatus === 'testing'}
          className="w-full"
          variant="outline"
        >
          {connectionStatus === 'testing' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Test en cours...
            </>
          ) : (
            'Tester la connexion'
          )}
        </Button>

        {connectionStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-red-800 mb-2">Solutions possibles:</h4>
            <ul className="text-xs text-red-700 space-y-1">
              <li>• Vérifiez que le backend FastAPI est démarré</li>
              <li>• Contrôlez l'URL dans le fichier .env</li>
              <li>• Vérifiez la configuration CORS du backend</li>
              <li>• Testez avec: curl {apiUrl}/health</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiConnectionTest;
