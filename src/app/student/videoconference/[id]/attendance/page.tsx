"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VideoconferenceMeeting, VideoconferenceAttendance } from '@/types/videoconference';
import { StudentLayout } from '@/components/layout/student-layout';

interface AttendancePageProps {
  params: {
    id: string;
  };
}

export default function StudentAttendancePage({ params }: AttendancePageProps) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<VideoconferenceMeeting | null>(null);
  const [attendance, setAttendance] = useState<VideoconferenceAttendance | null>(null);
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

    const fetchAttendance = async () => {
      try {
        // For students, we only fetch their own attendance record
        const response = await fetch(`/api/videoconference/attendance?meeting_id=${params.id}&student=true`);
        
        if (!response.ok) {
          throw new Error('Falha ao carregar dados de presença');
        }
        
        const data = await response.json();
        // We expect only one record for the current student
        setAttendance(data.length > 0 ? data[0] : null);
      } catch (err) {
        console.error('Erro ao carregar dados de presença:', err);
      }
    };

    fetchMeeting();
    fetchAttendance();
  }, [params.id]);

  const getAttendanceStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Presente</Badge>;
      case 'late':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Atrasado</Badge>;
      case 'absent':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ausente</Badge>;
      case 'excused':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Justificado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}min ${remainingSeconds}s`;
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
          <div>
            <h1 className="text-2xl font-bold">Meu Registro de Presença</h1>
            <p className="text-gray-500">{meeting.title}</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => router.push(`/student/videoconference/${params.id}`)}
          >
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Detalhes da Presença</CardTitle>
              <div className="text-sm text-gray-500">
                {formatDateTime(meeting.start_time)} - {formatDateTime(meeting.end_time)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!attendance ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum registro de presença encontrado</p>
                {meeting.status === 'scheduled' ? (
                  <p className="text-sm text-gray-400 mt-2">Seu registro de presença será criado quando você participar da videoconferência</p>
                ) : (
                  <p className="text-sm text-gray-400 mt-2">Você não participou desta videoconferência</p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="inline-block">
                    {getAttendanceStatusBadge(attendance.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Horário de Entrada</h3>
                    <p>{attendance.join_time ? formatDateTime(attendance.join_time) : 'Não registrado'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Horário de Saída</h3>
                    <p>{attendance.leave_time ? formatDateTime(attendance.leave_time) : 'Não registrado'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Tempo de Participação</h3>
                    <p>{attendance.duration ? formatDuration(attendance.duration) : 'Não registrado'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Porcentagem da Aula</h3>
                    {attendance.duration && meeting.start_time && meeting.end_time ? (
                      <div>
                        {(() => {
                          const meetingDuration = (new Date(meeting.end_time).getTime() - new Date(meeting.start_time).getTime()) / 1000;
                          const percentage = Math.min(100, Math.round((attendance.duration / meetingDuration) * 100));
                          
                          return (
                            <div>
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${
                                      percentage >= 75 ? 'bg-green-600' : 
                                      percentage >= 50 ? 'bg-yellow-400' : 
                                      'bg-red-600'
                                    }`} 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-sm font-medium">{percentage}%</span>
                              </div>
                              
                              {percentage < 75 && (
                                <p className="text-xs text-red-500 mt-1">
                                  É necessário participar de pelo menos 75% da aula para ser considerado presente.
                                </p>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <p>Não disponível</p>
                    )}
                  </div>
                </div>
                
                {attendance.status === 'absent' && (
                  <div className="bg-red-50 p-4 rounded-md mt-4">
                    <p className="text-red-700">Você foi marcado como ausente nesta videoconferência.</p>
                    <p className="text-sm text-red-600 mt-1">
                      Se você acredita que houve um erro, entre em contato com seu professor.
                    </p>
                  </div>
                )}
                
                {attendance.status === 'excused' && (
                  <div className="bg-blue-50 p-4 rounded-md mt-4">
                    <p className="text-blue-700">Sua ausência foi justificada para esta videoconferência.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
