"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VideoconferenceMeeting, VideoconferenceRecording } from '@/types/videoconference';
import { StudentLayout } from '@/components/layout/student-layout';

interface MeetingDetailsPageProps {
  params: {
    id: string;
  };
}

export default function StudentMeetingDetailsPage({ params }: MeetingDetailsPageProps) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<VideoconferenceMeeting | null>(null);
  const [recordings, setRecordings] = useState<VideoconferenceRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
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
      </StudentLayout>
    );
  }

  if (!meeting) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-500 mb-4">Videoconferência não encontrada</h3>
          <Button 
            onClick={() => router.push('/student/videoconference')}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            Voltar para Lista
          </Button>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Detalhes da Videoconferência</h1>
          <Button 
            variant="outline"
            onClick={() => router.push('/student/videoconference')}
          >
            Voltar
          </Button>
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
                  </div>
                  
                  <div className="pt-4">
                    {meeting.status === 'in_progress' || 
                     (meeting.status === 'scheduled' && new Date(meeting.start_time) <= new Date()) ? (
                      <Button 
                        className="bg-primary hover:bg-primary-dark text-white"
                        onClick={() => window.open(meeting.meeting_url, '_blank')}
                      >
                        Participar da Videoconferência
                      </Button>
                    ) : meeting.status === 'scheduled' ? (
                      <div className="text-gray-500">
                        <p>Esta videoconferência ainda não começou.</p>
                        <p className="text-sm">Você poderá participar quando a data de início chegar.</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <p>Esta videoconferência já foi encerrada.</p>
                        <p className="text-sm">Você pode assistir às gravações abaixo, se disponíveis.</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gravações</CardTitle>
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
                
                {recordings.length > 0 && (
                  <div className="mt-4">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/student/videoconference/${params.id}/recordings`)}
                    >
                      Ver Todas as Gravações
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Minha Presença</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/student/videoconference/${params.id}/attendance`)}
                >
                  Ver Meu Registro de Presença
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
