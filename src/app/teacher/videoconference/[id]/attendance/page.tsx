"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VideoconferenceMeeting, VideoconferenceAttendance } from '@/types/videoconference';

interface AttendancePageProps {
  params: {
    id: string;
  };
}

export default function AttendancePage({ params }: AttendancePageProps) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<VideoconferenceMeeting | null>(null);
  const [attendance, setAttendance] = useState<VideoconferenceAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

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
        const response = await fetch(`/api/videoconference/attendance?meeting_id=${params.id}`);
        
        if (!response.ok) {
          throw new Error('Falha ao carregar dados de presença');
        }
        
        const data = await response.json();
        setAttendance(data);
      } catch (err) {
        console.error('Erro ao carregar dados de presença:', err);
      }
    };

    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        // If meeting has a course, fetch students enrolled in that course
        // Otherwise, fetch all students
        const response = await fetch('/api/users?role=student');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar lista de alunos');
        }
        
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        console.error('Erro ao carregar lista de alunos:', err);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchMeeting();
    fetchAttendance();
    fetchStudents();
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

  const handleUpdateAttendance = async (userId: string, status: string) => {
    try {
      const response = await fetch('/api/videoconference/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meeting_id: params.id,
          user_id: userId,
          status
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar presença');
      }

      // Refresh attendance list
      const attendanceResponse = await fetch(`/api/videoconference/attendance?meeting_id=${params.id}`);
      if (attendanceResponse.ok) {
        const data = await attendanceResponse.json();
        setAttendance(data);
      }
    } catch (err) {
      console.error('Erro ao atualizar presença:', err);
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

  // Create a map of user IDs to attendance records
  const attendanceMap = new Map();
  attendance.forEach(record => {
    attendanceMap.set(record.user_id, record);
  });

  return (
    <TeacherLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Controle de Presença</h1>
            <p className="text-gray-500">{meeting.title}</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => router.push(`/teacher/videoconference/${params.id}`)}
          >
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Lista de Presença</CardTitle>
              <div className="text-sm text-gray-500">
                {formatDateTime(meeting.start_time)} - {formatDateTime(meeting.end_time)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingStudents ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum aluno encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-2 text-left">Aluno</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Entrada</th>
                      <th className="px-4 py-2 text-left">Saída</th>
                      <th className="px-4 py-2 text-left">Duração</th>
                      <th className="px-4 py-2 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => {
                      const attendanceRecord = attendanceMap.get(student.id);
                      
                      return (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              {student.avatar_url ? (
                                <img 
                                  src={student.avatar_url} 
                                  alt={student.name} 
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                  {student.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-xs text-gray-500">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {attendanceRecord ? (
                              getAttendanceStatusBadge(attendanceRecord.status)
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                Não registrado
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {attendanceRecord?.join_time ? (
                              formatDateTime(attendanceRecord.join_time)
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {attendanceRecord?.leave_time ? (
                              formatDateTime(attendanceRecord.leave_time)
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {attendanceRecord?.duration ? (
                              formatDuration(attendanceRecord.duration)
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => handleUpdateAttendance(student.id, 'present')}
                              >
                                Presente
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                                onClick={() => handleUpdateAttendance(student.id, 'late')}
                              >
                                Atrasado
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleUpdateAttendance(student.id, 'absent')}
                              >
                                Ausente
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
}
