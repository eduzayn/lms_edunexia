import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoconferenceRecording } from '@/types/videoconference';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecordingPlayerProps {
  recording: VideoconferenceRecording;
  onClose?: () => void;
}

export function RecordingPlayer({ recording, onClose }: RecordingPlayerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError('Não foi possível carregar a gravação. Por favor, tente novamente mais tarde.');
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{recording.title || 'Gravação'}</CardTitle>
        <div className="text-sm text-gray-500">
          {formatDateTime(recording.created_at)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center items-center h-64 bg-gray-100 rounded-md">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
              <p>{error}</p>
              <Button 
                onClick={() => window.open(recording.url, '_blank')}
                variant="outline"
                className="mt-2"
              >
                Abrir em Nova Janela
              </Button>
            </div>
          )}
          
          <div className={`relative pt-[56.25%] ${loading ? 'hidden' : 'block'}`}>
            <iframe
              src={recording.url}
              className="absolute top-0 left-0 w-full h-full rounded-md"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            ></iframe>
          </div>
          
          <div className="flex justify-between items-center">
            {recording.duration && (
              <div className="text-sm text-gray-500">
                Duração: {Math.floor(recording.duration / 60)} min {recording.duration % 60} seg
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => window.open(recording.url, '_blank')}
              >
                Abrir em Nova Janela
              </Button>
              
              {onClose && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                >
                  Fechar
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
