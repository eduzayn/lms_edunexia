"use client";

import React, { useState } from 'react';

interface TextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ 
  initialContent = '', 
  onChange 
}) => {
  const [content, setContent] = useState(initialContent);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  return (
    <div className="w-full">
      <textarea
        className="w-full min-h-[300px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={content}
        onChange={handleChange}
        placeholder="Digite o conteúdo aqui..."
      />
    </div>
  );
};

export default TextEditor;
