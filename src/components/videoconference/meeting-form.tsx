"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// import { Select } from '@/components/ui/select';
// Removed Switch import
// Removed DatePicker import
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoconferencePlatform, VideoconferenceMeeting } from '@/types/videoconference';

interface MeetingFormProps {
  initialData?: Partial<VideoconferenceMeeting>;
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export function MeetingForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isEditing = false
}: MeetingFormProps) {
  const [platforms, setPlatforms] = useState<VideoconferencePlatform[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    platform_id: initialData?.platform_id || '',
    course_id: initialData?.course_id || '',
    start_time: initialData?.start_time ? new Date(initialData.start_time) : new Date(),
    end_time: initialData?.end_time ? new Date(initialData.end_time) : new Date(Date.now() + 60 * 60 * 1000),
    recurring: initialData?.recurring || false,
    recurrence_pattern: initialData?.recurrence_pattern || '',
    status: initialData?.status || 'scheduled',
    password: initialData?.password || ''
  });

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await fetch('/api/videoconference/platforms');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar plataformas');
        }
        
        const data = await response.json();
        setPlatforms(data);
        
        // Set default platform if none selected
        if (!formData.platform_id && data.length > 0) {
          setFormData(prev => ({ ...prev, platform_id: data[0].id }));
        }
      } catch (err) {
        console.error('Erro ao carregar plataformas:', err);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar cursos');
        }
        
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('Erro ao carregar cursos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
    fetchCourses();
  }, [formData.platform_id]);

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
      if (!formData.title || !formData.platform_id || !formData.start_time || !formData.end_time) {
        throw new Error('Por favor, preencha todos os campos obrigatórios');
      }

      // Format dates for API
      const apiData = {
        ...formData,
        start_time: formData.start_time.toISOString(),
        end_time: formData.end_time.toISOString(),
        course_id: formData.course_id || undefined
      };

      await onSubmit(apiData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao salvar videoconferência:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Videoconferência' : 'Nova Videoconferência'}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
            <p>Videoconferência {isEditing ? 'atualizada' : 'criada'} com sucesso!</p>
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
            <Label htmlFor="platform_id">Plataforma *</Label>
            <select
              id="platform_id"
              name="platform_id"
              value={formData.platform_id}
              onChange={handleInputChange}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Selecione uma plataforma</option>
              {platforms.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.display_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course_id">Curso (opcional)</Label>
            <select
              id="course_id"
              name="course_id"
              value={formData.course_id}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Selecione um curso</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="start_time">Data e Hora de Início *</Label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.start_time.toISOString().slice(0, 16)}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  handleDateChange(date, 'start_time');
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">Data e Hora de Término *</Label>
              <input
                type="datetime-local"
                id="end_time"
                name="end_time"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.end_time.toISOString().slice(0, 16)}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  handleDateChange(date, 'end_time');
                }}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.recurring}
              onChange={(e) => handleSwitchChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="recurring">Reunião recorrente</Label>
          </div>

          {formData.recurring && (
            <div className="space-y-2">
              <Label htmlFor="recurrence_pattern">Padrão de Recorrência</Label>
              <select
                id="recurrence_pattern"
                name="recurrence_pattern"
                value={formData.recurrence_pattern as string || ''}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Selecione um padrão</option>
                <option value="daily">Diariamente</option>
                <option value="weekly">Semanalmente</option>
                <option value="biweekly">Quinzenalmente</option>
                <option value="monthly">Mensalmente</option>
              </select>
            </div>
          )}

          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="scheduled">Agendada</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluída</option>
                <option value="cancelled">Cancelada</option>
              </select>
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
              onClick={onCancel}
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
              ) : isEditing ? 'Salvar Alterações' : 'Criar Videoconferência'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
