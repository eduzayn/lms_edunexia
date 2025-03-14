import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Loader2, Mic, FileVideo, Check, AlertCircle, Sparkles } from "lucide-react";
import { VideoCourseSelector } from "./video-course-selector";

interface Course {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
  }[];
}

interface VideoGeneratorProps {
  onVideoGenerated?: (videoId: string) => void;
  courseId?: string;
  lessonId?: string;
  courses?: Course[];
}

export function VideoGenerator({
  onVideoGenerated,
  courseId: initialCourseId,
  lessonId: initialLessonId,
  courses = []
}: VideoGeneratorProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [script, setScript] = React.useState('');
  const [isGeneratingScript, setIsGeneratingScript] = React.useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = React.useState(false);
  const [style, setStyle] = React.useState<'educational' | 'professional' | 'casual'>('educational');
  const [voiceType, setVoiceType] = React.useState<'male' | 'female'>('female');
  const [includeSubtitles, setIncludeSubtitles] = React.useState(true);
  const [duration, setDuration] = React.useState(180);
  const [isRecording, setIsRecording] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isVoiceInputSupported, setIsVoiceInputSupported] = React.useState(false);
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>(initialCourseId || '');
  const [selectedLessonId, setSelectedLessonId] = React.useState<string>(initialLessonId || '');
  const [jobId, setJobId] = React.useState<string | null>(null);
  const [jobStatus, setJobStatus] = React.useState<string | null>(null);
  const [pollInterval, setPollInterval] = React.useState<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // Check if SpeechRecognition is supported
    setIsVoiceInputSupported(
      'SpeechRecognition' in window || 
      'webkitSpeechRecognition' in window
    );
  }, []);

  const handleGenerateScript = async () => {
    if (!title || !description) {
      setError('Título e descrição são obrigatórios para gerar o roteiro.');
      return;
    }
    
    setIsGeneratingScript(true);
    setError(null);
    
    try {
      const response = await fetch('/api/content/video/script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          style,
          duration
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar roteiro');
      }
      
      setScript(data.script);
      setSuccess('Roteiro gerado com sucesso!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao gerar roteiro');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Handle course and lesson selection
  const handleCourseSelection = (courseId: string, lessonId: string) => {
    setSelectedCourseId(courseId);
    setSelectedLessonId(lessonId);
  };
  
  // Poll for job status
  const pollJobStatus = React.useCallback(async (jobId: string) => {
    try {
      const response = await fetch(`/api/content/video?jobId=${jobId}`);
      const data = await response.json();
      
      if (response.ok) {
        setJobStatus(data.status);
        
        if (data.status === 'completed' && data.result && data.result.videoId) {
          if (pollInterval) {
            clearInterval(pollInterval);
            setPollInterval(null);
          }
          
          setSuccess('Vídeo gerado com sucesso!');
          setIsGeneratingVideo(false);
          
          if (onVideoGenerated) {
            onVideoGenerated(data.result.videoId);
          }
        } else if (data.status === 'failed') {
          if (pollInterval) {
            clearInterval(pollInterval);
            setPollInterval(null);
          }
          
          setError(data.error || "Falha ao gerar vídeo");
          setIsGeneratingVideo(false);
        }
      }
    } catch (err) {
      console.error("Error polling job status:", err);
    }
  }, [onVideoGenerated, pollInterval]);
  
  // Clean up interval on unmount
  React.useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  const handleGenerateVideo = async () => {
    if (!title || !description || !script) {
      setError('Título, descrição e roteiro são obrigatórios para gerar o vídeo.');
      return;
    }
    
    setIsGeneratingVideo(true);
    setError(null);
    setJobId(null);
    setJobStatus(null);
    
    try {
      const response = await fetch('/api/content/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          script,
          style,
          voiceType,
          includeSubtitles,
          duration,
          courseId: selectedCourseId || undefined,
          lessonId: selectedLessonId || undefined
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar vídeo');
      }
      
      if (data.jobId) {
        setJobId(data.jobId);
        setJobStatus('pending');
        
        // Start polling for job status
        const interval = setInterval(() => pollJobStatus(data.jobId), 5000);
        setPollInterval(interval);
      } else if (data.videoId) {
        // For backward compatibility
        setSuccess('Vídeo gerado com sucesso!');
        
        if (onVideoGenerated) {
          onVideoGenerated(data.videoId);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao gerar vídeo');
      setIsGeneratingVideo(false);
    }
  };

  const startVoiceInput = (field: 'title' | 'description' | 'script') => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Seu navegador não suporta entrada de voz.');
      return;
    }
    
    setIsRecording(true);
    
    // @ts-expect-error - SpeechRecognition is not in the TypeScript types
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      
      if (field === 'title') {
        setTitle(transcript);
      } else if (field === 'description') {
        setDescription(transcript);
      } else if (field === 'script') {
        setScript(transcript);
      }
    };
    
    recognition.onerror = (event: any) => {
      setError(`Erro na entrada de voz: ${event.error}`);
      setIsRecording(false);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognition.start();
    
    // Stop after 30 seconds
    setTimeout(() => {
      recognition.stop();
    }, 30000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gerador de Vídeo com IA</CardTitle>
        <CardDescription>
          Crie vídeos educacionais com narração e legendas automaticamente
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start gap-2">
            <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>{success}</p>
          </div>
        )}
        
        {courses && courses.length > 0 && (
          <VideoCourseSelector
            courses={courses}
            onSelect={handleCourseSelection}
            selectedCourseId={selectedCourseId}
            selectedLessonId={selectedLessonId}
          />
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Título do Vídeo
            </label>
            <div className="flex">
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Digite o título do vídeo"
              />
              {isVoiceInputSupported && (
                <button
                  type="button"
                  onClick={() => startVoiceInput('title')}
                  disabled={isRecording}
                  className="px-3 py-2 bg-primary/10 text-primary border border-l-0 rounded-r-md hover:bg-primary/20 disabled:opacity-50"
                >
                  <Mic className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Descrição
            </label>
            <div className="flex">
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Descreva o conteúdo do vídeo"
              />
              {isVoiceInputSupported && (
                <button
                  type="button"
                  onClick={() => startVoiceInput('description')}
                  disabled={isRecording}
                  className="px-3 py-2 bg-primary/10 text-primary border border-l-0 rounded-r-md hover:bg-primary/20 disabled:opacity-50"
                >
                  <Mic className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="style" className="block text-sm font-medium mb-1">
                Estilo
              </label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="educational">Educacional</option>
                <option value="professional">Profissional</option>
                <option value="casual">Casual</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="voiceType" className="block text-sm font-medium mb-1">
                Tipo de Voz
              </label>
              <select
                id="voiceType"
                value={voiceType}
                onChange={(e) => setVoiceType(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="female">Feminina</option>
                <option value="male">Masculina</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium mb-1">
                Duração (segundos)
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                min={30}
                max={600}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeSubtitles"
              checked={includeSubtitles}
              onChange={(e) => setIncludeSubtitles(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="includeSubtitles" className="ml-2 block text-sm">
              Incluir legendas
            </label>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="script" className="block text-sm font-medium">
                Roteiro
              </label>
              <button
                type="button"
                onClick={handleGenerateScript}
                disabled={isGeneratingScript || !title || !description}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50"
              >
                {isGeneratingScript ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                <span>Gerar Roteiro</span>
              </button>
            </div>
            <div className="flex">
              <textarea
                id="script"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={8}
                placeholder="Digite ou gere o roteiro do vídeo"
              />
              {isVoiceInputSupported && (
                <button
                  type="button"
                  onClick={() => startVoiceInput('script')}
                  disabled={isRecording}
                  className="px-3 py-2 bg-primary/10 text-primary border border-l-0 rounded-r-md hover:bg-primary/20 disabled:opacity-50"
                >
                  <Mic className="h-5 w-5" />
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {script ? `${script.length} caracteres` : 'O roteiro será narrado no vídeo'}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {isRecording && (
            <div className="flex items-center gap-2 text-red-500">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>Gravando...</span>
            </div>
          )}
          
          {jobId && jobStatus && !success && !error && (
            <div className="flex items-center gap-2 text-blue-500">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span>
                Status: {jobStatus === 'pending' ? 'Aguardando processamento' : 
                        jobStatus === 'processing' ? 'Gerando vídeo' : 
                        jobStatus}
              </span>
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleGenerateVideo}
          disabled={isGeneratingVideo || !title || !description || !script}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isGeneratingVideo ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>
                {jobStatus === 'pending' ? 'Aguardando processamento...' : 
                 jobStatus === 'processing' ? 'Gerando vídeo...' : 
                 'Iniciando geração...'}
              </span>
            </>
          ) : (
            <>
              <FileVideo className="h-5 w-5" />
              <span>Gerar Vídeo</span>
            </>
          )}
        </button>
      </CardFooter>
    </Card>
  );
}
