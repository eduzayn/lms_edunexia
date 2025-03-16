"use client";

import React, { useState } from 'react';

interface VideoUploaderProps {
  onUpload?: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onUpload,
  accept = "video/mp4,video/webm,video/ogg",
  maxSize = 100 // 100MB default
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const selectedFile = e.target.files[0];
    
    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`O arquivo é muito grande. O tamanho máximo é ${maxSize}MB.`);
      return;
    }
    
    setFile(selectedFile);
    
    if (onUpload) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="w-full">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id="video-upload"
          disabled={uploading}
        />
        <label
          htmlFor="video-upload"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {uploading ? "Enviando..." : "Clique para selecionar um vídeo ou arraste e solte aqui"}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            MP4, WebM ou OGG (Máx. {maxSize}MB)
          </p>
        </label>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
      
      {file && !error && (
        <div className="mt-2 text-sm text-green-600">
          Arquivo selecionado: {file.name}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
