import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Download, Subtitles, Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  subtitlesUrl?: string;
  onClose?: () => void;
}

export function VideoPlayer({
  videoId,
  title,
  description,
  videoUrl,
  thumbnailUrl,
  subtitlesUrl,
  onClose
}: VideoPlayerProps) {
  const [isMuted, setIsMuted] = React.useState(false);
  const [showSubtitles, setShowSubtitles] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

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
      </CardContent>
      
      <CardFooter className="flex justify-between">
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
      </CardFooter>
    </Card>
  );
}
