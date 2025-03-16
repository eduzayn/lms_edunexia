import React from 'react';
import { VideoconferenceMeeting } from '@/types/videoconference';
import { MeetingCard } from './meeting-card';
import { Button } from '@/components/ui/button';

interface MeetingListProps {
  meetings: VideoconferenceMeeting[];
  loading: boolean;
  error: string | null;
  onViewDetails: (meetingId: string) => void;
  onJoin?: (meetingUrl: string) => void;
  onViewRecordings?: (meetingId: string) => void;
  onCreateNew?: () => void;
  onRetry?: () => void;
  isTeacher?: boolean;
  emptyMessage?: string;
}

export function MeetingList({
  meetings,
  loading,
  error,
  onViewDetails,
  onJoin,
  onViewRecordings,
  onCreateNew,
  onRetry,
  isTeacher = false,
  emptyMessage = 'Nenhuma videoconferência encontrada'
}: MeetingListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>{error}</p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="mt-2"
          >
            Tentar Novamente
          </Button>
        )}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500 mb-4">{emptyMessage}</h3>
        {isTeacher && onCreateNew && (
          <Button 
            onClick={onCreateNew}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            Criar Nova Videoconferência
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {meetings.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          meeting={meeting}
          onViewDetails={onViewDetails}
          onJoin={onJoin}
          onViewRecordings={onViewRecordings}
          isTeacher={isTeacher}
        />
      ))}
    </div>
  );
}
