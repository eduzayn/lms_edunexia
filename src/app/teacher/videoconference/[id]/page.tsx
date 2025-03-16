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

interface MeetingDetailsPageProps {
  params: {
    id: string;
  };
}

export default function MeetingDetailsPage({ params }: MeetingDetailsPageProps) {
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

  const getMeetingStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Agendada</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Em Andamento</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Concluída</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

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

  const handleDeleteMeeting = async () => {
    if (!confirm('Tem certeza que deseja excluir esta videoconferência?')) {
      return;
    }

    try {
      const response = await fetch(`/api/videoconference/meetings/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir videoconferência');
      }

      router.push('/teacher/videoconference');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao excluir videoconferência:', err);
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
          <h1 className="text-2xl font-bold">Detalhes da Videoconferência</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => router.push('/teacher/videoconference')}
            >
              Voltar
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push(`/teacher/videoconference/${params.id}/edit`)}
            >
              Editar
            </Button>
            <Button 
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleDeleteMeeting}
            >
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{meeting.title}</CardTitle>
                  {getMeetingStatusBadge(meeting.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">{meeting.description || 'Sem descrição'}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Plataforma</h3>
                      <p>{meeting.platform?.display_name || meeting.platform_id}</p>
                    </div>
                    
                    {meeting.course_id && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Curso</h3>
                        <p>{meeting.course?.title || meeting.course_id}</p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Data e Hora de Início</h3>
                      <p>{formatDateTime(meeting.start_time)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Data e Hora de Término</h3>
                      <p>{formatDateTime(meeting.end_time)}</p>
                    </div>
                    
                    {meeting.recurring && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Recorrência</h3>
                        <p>{
                          meeting.recurrence_pattern === 'daily' ? 'Diariamente' :
                          meeting.recurrence_pattern === 'weekly' ? 'Semanalmente' :
                          meeting.recurrence_pattern === 'biweekly' ? 'Quinzenalmente' :
                          meeting.recurrence_pattern === 'monthly' ? 'Mensalmente' :
                          meeting.recurrence_pattern
                        }</p>
                      </div>
                    )}
                    
                    {meeting.meeting_url && (
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500">Link da Reunião</h3>
                        <p className="break-all text-blue-600 hover:underline">
                          <a href={meeting.meeting_url} target="_blank" rel="noopener noreferrer">
                            {meeting.meeting_url}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      className="bg-primary hover:bg-primary-dark text-white"
                      onClick={() => window.open(meeting.meeting_url, '_blank')}
                    >
                      Iniciar Videoconferência
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Gravações</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSyncRecordings}
                    disabled={syncingRecordings}
                  >
                    {syncingRecordings ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Sincronizando...
                      </>
                    ) : 'Sincronizar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recordings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhuma gravação disponível</p>
                ) : (
                  <ul className="space-y-3">
                    {recordings.map((recording) => (
                      <li key={recording.id} className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{recording.title || 'Gravação'}</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(recording.created_at), "dd/MM/yyyy HH:mm")}
                            </p>
                          </div>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(recording.url, '_blank')}
                          >
                            Assistir
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="mt-4">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push(`/teacher/videoconference/${params.id}/recordings`)}
                  >
                    Ver Todas as Gravações
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Presença</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/teacher/videoconference/${params.id}/attendance`)}
                >
                  Gerenciar Presença
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
