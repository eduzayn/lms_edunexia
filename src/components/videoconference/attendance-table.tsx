import React from 'react';
import { VideoconferenceAttendance } from '@/types/videoconference';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AttendanceTableProps {
  attendanceRecords: VideoconferenceAttendance[];
  loading: boolean;
  error: string | null;
}

export function AttendanceTable({ attendanceRecords, loading, error }: AttendanceTableProps) {
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

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}min ${remainingSeconds}s`;
  };

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
      </div>
    );
  }

  if (attendanceRecords.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-500 mb-4">Nenhum registro de presença encontrado</h3>
        <p className="text-gray-400">Os registros de presença aparecerão aqui quando os participantes entrarem na videoconferência</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Participante
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Entrada
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Saída
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duração
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {attendanceRecords.map((record) => (
            <tr key={record.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {record.user?.avatar_url && (
                    <div className="flex-shrink-0 h-10 w-10 mr-3">
                      <img 
                        className="h-10 w-10 rounded-full" 
                        src={record.user.avatar_url} 
                        alt={record.user.name} 
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {record.user?.name || 'Usuário Desconhecido'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record.user?.email || ''}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getAttendanceStatusBadge(record.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDateTime(record.join_time)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDateTime(record.leave_time)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDuration(record.duration)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
