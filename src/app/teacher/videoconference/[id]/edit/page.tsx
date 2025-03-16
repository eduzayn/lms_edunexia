"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { VideoconferenceMeeting } from '@/types/videoconference';

interface EditMeetingPageProps {
  params: {
    id: string;
  };
}

export default function EditMeetingPage({ params }: EditMeetingPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform_id: '',
    course_id: '',
    start_time: new Date(),
    end_time: new Date(),
    recurring: false,
    recurrence_pattern: '',
    status: '',
    password: ''
  });

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/videoconference/meetings/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Falha ao carregar detalhes da reunião');
        }
        
        const meeting: VideoconferenceMeeting = await response.json();
        
        setFormData({
          title: meeting.title,
          description: meeting.description || '',
          platform_id: meeting.platform_id,
          course_id: meeting.course_id || '',
          start_time: new Date(meeting.start_time),
          end_time: new Date(meeting.end_time),
          recurring: meeting.recurring || false,
          recurrence_pattern: meeting.recurrence_pattern || '',
          status: meeting.status,
          password: meeting.password || ''
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao carregar detalhes da reunião:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await fetch('/api/courses');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar cursos');
        }
        
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('Erro ao carregar cursos:', err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchMeeting();
    fetchCourses();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, recurring: checked }));
  };

  const handleDateChange = (date: Date, field: 'start_time' | 'end_time') => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate form
      if (!formData.title || !formData.start_time || !formData.end_time) {
        throw new Error('Por favor, preencha todos os campos obrigatórios');
      }

      // Format dates for API
      const apiData = {
        ...formData,
        start_time: formData.start_time.toISOString(),
        end_time: formData.end_time.toISOString(),
        course_id: formData.course_id || undefined
      };

      const response = await fetch(`/api/videoconference/meetings/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar videoconferência');
      }

      setSuccess(true);
      
      // Redirect to meeting details after successful update
      setTimeout(() => {
        router.push(`/teacher/videoconference/${params.id}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao atualizar videoconferência:', err);
    } finally {
      setSaving(false);
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

  return (
    <TeacherLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editar Videoconferência</h1>
          <Button 
            variant="outline"
            onClick={() => router.push(`/teacher/videoconference/${params.id}`)}
          >
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Videoconferência</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
                <p>Videoconferência atualizada com sucesso! Redirecionando...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Digite o título da videoconferência"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Digite uma descrição para a videoconferência"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="scheduled">Agendada</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                  <option value="cancelled">Cancelada</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course_id">Curso (opcional)</Label>
                <Select
                  id="course_id"
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleInputChange}
                  disabled={loadingCourses}
                >
                  <option value="">Selecione um curso</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </Select>
                {loadingCourses && <p className="text-sm text-gray-500">Carregando cursos...</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Data e Hora de Início *</Label>
                  <DatePicker
                    id="start_time"
                    selected={formData.start_time}
                    onChange={(date) => handleDateChange(date as Date, 'start_time')}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time">Data e Hora de Término *</Label>
                  <DatePicker
                    id="end_time"
                    selected={formData.end_time}
                    onChange={(date) => handleDateChange(date as Date, 'end_time')}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={formData.recurring}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="recurring">Reunião recorrente</Label>
              </div>

              {formData.recurring && (
                <div className="space-y-2">
                  <Label htmlFor="recurrence_pattern">Padrão de Recorrência</Label>
                  <Select
                    id="recurrence_pattern"
                    name="recurrence_pattern"
                    value={formData.recurrence_pattern}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione um padrão</option>
                    <option value="daily">Diariamente</option>
                    <option value="weekly">Semanalmente</option>
                    <option value="biweekly">Quinzenalmente</option>
                    <option value="monthly">Mensalmente</option>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Senha (opcional)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Digite uma senha para a videoconferência"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/teacher/videoconference/${params.id}`)}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Salvando...
                    </>
                  ) : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
}
