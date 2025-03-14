// @ts-nocheck
import * as React from "react";
import { VideoGenerator } from "../../../../components/content/video-generator";

export default function VideoGeneratorPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gerador de Vídeo com IA</h1>
        <p className="text-muted-foreground">
          Crie vídeos educacionais com narração e legendas automaticamente
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <VideoGenerator />
      </div>
    </div>
  );
}
