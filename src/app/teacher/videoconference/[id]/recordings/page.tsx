"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VideoconferenceMeeting, VideoconferenceRecording } from '@/types/videoconference';

interface RecordingsPageProps {
  params: {
    id: string;
  };
}

export default function RecordingsPage({ params }: RecordingsPageProps) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<VideoconferenceMeeting | null>(null);
  const [recordings, setRecordings] = useState<VideoconferenceRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncingRecordings, setSyncingRecordings] = useState(false);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/videoconference/meetings/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Falha ao carregar detalhes da reunião');
        }
        
        const data = await response.json();
        setMeeting(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao carregar detalhes da reunião:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecordings = async () => {
      try {
        const response = await fetch(`/api/videoconference/recordings?meeting_id=${params.id}`);
        
        if (!response.ok) {
          throw new Error('Falha ao carregar gravações');
        }
        
        const data = await response.json();
        setRecordings(data);
      } catch (err) {
        console.error('Erro ao carregar gravações:', err);
      }
    };

    fetchMeeting();
    fetchRecordings();
  }, [params.id]);

  const handleSyncRecordings = async () => {
    try {
      setSyncingRecordings(true);
      const response = await fetch('/api/videoconference/recordings/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meeting_id: params.id }),
      });

      if (!response.ok) {
        throw new Error('Falha ao sincronizar gravações');
      }

      // Refresh recordings list
      const recordingsResponse = await fetch(`/api/videoconference/recordings?meeting_id=${params.id}`);
      if (recordingsResponse.ok) {
        const data = await recordingsResponse.json();
        setRecordings(data);
      }
    } catch (err) {
      console.error('Erro ao sincronizar gravações:', err);
    } finally {
      setSyncingRecordings(false);
    }
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </TeacherLayout>
    );
  }

  if (error) {
    return (
      <TeacherLayout>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-2"
          >
            Tentar Novamente
          </Button>
        </div>
      </TeacherLayout>
    );
  }

  if (!meeting) {
    return (
      <TeacherLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-500 mb-4">Videoconferência não encontrada</h3>
          <Button 
            onClick={() => router.push('/teacher/videoconference')}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            Voltar para Lista
          </Button>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gravações</h1>
            <p className="text-gray-500">{meeting.title}</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => router.push(`/teacher/videoconference/${params.id}`)}
            >
              Voltar
            </Button>
            <Button 
              variant="outline"
              onClick={handleSyncRecordings}
              disabled={syncingRecordings}
            >
              {syncingRecordings ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Sincronizando...
                </>
              ) : 'Sincronizar Gravações'}
            </Button>
          </div>
        </div>

        {recordings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500 mb-4">Nenhuma gravação disponível</h3>
            <p className="text-gray-400 mb-6">As gravações aparecerão aqui após a conclusão da videoconferência</p>
            <Button 
              onClick={handleSyncRecordings}
              className="bg-primary hover:bg-primary-dark text-white"
              disabled={syncingRecordings}
            >
              {syncingRecordings ? 'Sincronizando...' : 'Sincronizar Agora'}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((recording) => (
              <Card key={recording.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">{recording.title || 'Gravação'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Data: {format(new Date(recording.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Hora: {format(new Date(recording.created_at), "HH:mm", { locale: ptBR })}</span>
                      </div>
                    </div>
                    
                    {recording.duration && (
                      <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Duração: {Math.floor(recording.duration / 60)} min {recording.duration % 60} seg</span>
                      </div>
                    )}
                    
                    <div className="pt-3 flex justify-between">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {recording.format || 'MP4'}
                      </Badge>
                      
                      <Button 
                        className="bg-primary hover:bg-primary-dark text-white"
                        size="sm"
                        onClick={() => window.open(recording.url, '_blank')}
                      >
                        Assistir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
