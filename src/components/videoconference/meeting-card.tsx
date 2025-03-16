import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VideoconferenceMeeting } from '@/types/videoconference';

interface MeetingCardProps {
  meeting: VideoconferenceMeeting;
  onViewDetails: (meetingId: string) => void;
  onJoin?: (meetingUrl: string) => void;
  onViewRecordings?: (meetingId: string) => void;
  isTeacher?: boolean;
}

export function MeetingCard({ 
  meeting, 
  onViewDetails, 
  onJoin, 
  onViewRecordings,
  isTeacher = false 
}: MeetingCardProps) {
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

  const canJoin = meeting.status === 'in_progress' || 
    (meeting.status === 'scheduled' && new Date(meeting.start_time) <= new Date());

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{meeting.title}</CardTitle>
          {getMeetingStatusBadge(meeting.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-500">{meeting.description || 'Sem descrição'}</p>
          
          <div className="text-xs text-gray-500">
            <div className="flex items-center mb-1">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Início: {formatDateTime(meeting.start_time)}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Término: {formatDateTime(meeting.end_time)}</span>
            </div>
          </div>
          
          {meeting.course_id && (
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Curso: {meeting.course_id}</span>
            </div>
          )}
          
          {meeting.platform && (
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Plataforma: {meeting.platform.display_name}</span>
            </div>
          )}
          
          <div className="pt-3 flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(meeting.id)}
            >
              Detalhes
            </Button>
            
            {canJoin && onJoin ? (
              <Button 
                className="bg-primary hover:bg-primary-dark text-white"
                size="sm"
                onClick={() => onJoin(meeting.meeting_url)}
              >
                Participar
              </Button>
            ) : meeting.status === 'scheduled' ? (
              <Button 
                variant="outline"
                size="sm"
                disabled
              >
                Aguardando
              </Button>
            ) : meeting.status === 'completed' && onViewRecordings ? (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => onViewRecordings(meeting.id)}
              >
                Ver Gravações
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
