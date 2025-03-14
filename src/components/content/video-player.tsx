import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Download, MessageSquare, Star, Subtitles, Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  subtitlesUrl?: string;
  onClose?: () => void;
  userId?: string;
}

export function VideoPlayer({
  videoId,
  title,
  description,
  videoUrl,
  thumbnailUrl,
  subtitlesUrl,
  onClose,
  userId
}: VideoPlayerProps) {
  const [isMuted, setIsMuted] = React.useState(false);
  const [showSubtitles, setShowSubtitles] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  // New state variables for feedback and progress tracking
  const [rating, setRating] = React.useState<number | null>(null);
  const [feedback, setFeedback] = React.useState('');
  const [showFeedbackForm, setShowFeedbackForm] = React.useState(false);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = React.useState(false);
  const [watchProgress, setWatchProgress] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const toggleSubtitles = () => {
    if (videoRef.current && subtitlesUrl) {
      const tracks = videoRef.current.textTracks;
      if (tracks.length > 0) {
        tracks[0].mode = showSubtitles ? 'hidden' : 'showing';
        setShowSubtitles(!showSubtitles);
      }
    }
  };
  
  // Track video progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setWatchProgress(progress);
    }
  };
  
  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (!rating || !userId) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/content/video/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          rating,
          comment: feedback
        }),
      });
      
      if (response.ok) {
        setIsFeedbackSubmitted(true);
        setShowFeedbackForm(false);
      } else {
        console.error('Error submitting feedback:', await response.text());
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      
      <CardContent>
        <div className="relative aspect-video bg-black rounded-md overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            poster={thumbnailUrl}
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
          >
            <source src={videoUrl} type="video/mp4" />
            {subtitlesUrl && (
              <track
                kind="subtitles"
                src={subtitlesUrl}
                srcLang="pt-BR"
                label="Português"
                default={showSubtitles}
              />
            )}
            Seu navegador não suporta a reprodução de vídeos.
          </video>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-1 mt-2">
          <div 
            className="bg-primary h-1" 
            style={{ width: `${watchProgress}%` }}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col">
        <div className="flex justify-between w-full mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-muted"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
            
            {subtitlesUrl && (
              <button
                type="button"
                onClick={toggleSubtitles}
                className={`inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-muted ${
                  showSubtitles ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Subtitles className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {userId && !showFeedbackForm && !isFeedbackSubmitted && (
              <button
                type="button"
                onClick={() => setShowFeedbackForm(true)}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm border rounded-md hover:bg-muted"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Avaliar Vídeo</span>
              </button>
            )}
            
            {isFeedbackSubmitted && (
              <span className="text-sm text-green-600">Obrigado pelo feedback!</span>
            )}
            
            <a
              href={videoUrl}
              download={`${title}.mp4`}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm border rounded-md hover:bg-muted"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </a>
            
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 text-sm border rounded-md hover:bg-muted"
              >
                Fechar
              </button>
            )}
          </div>
        </div>
        
        {/* Feedback form */}
        {showFeedbackForm && (
          <div className="w-full mt-2 p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Avalie este vídeo</h4>
            
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`h-8 w-8 flex items-center justify-center rounded-full ${
                    rating && star <= rating ? 'bg-yellow-400 text-white' : 'bg-gray-100'
                  }`}
                >
                  <Star className={`h-4 w-4 ${rating && star <= rating ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
            
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Comentários (opcional)"
              className="w-full px-3 py-2 border rounded-md mb-3"
              rows={3}
            />
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFeedbackForm(false)}
                className="px-3 py-1 text-sm border rounded-md hover:bg-muted"
              >
                Cancelar
              </button>
              
              <button
                type="button"
                onClick={handleSubmitFeedback}
                disabled={!rating || isSubmitting}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
