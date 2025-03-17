"use client"

import { useState } from "react"
import { RichTextEditor } from "@/components/editor/rich-text-editor"

export default function EditorPage() {
  const [content, setContent] = useState("")

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Editor de Texto Rico</h1>
      <div className="space-y-4">
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Digite seu conteúdo aqui..."
        />
        <div className="rounded-md bg-muted p-4">
          <h2 className="mb-2 text-lg font-semibold">HTML Gerado:</h2>
          <pre className="whitespace-pre-wrap text-sm">{content}</pre>
        </div>
      </div>
    </div>
  )
} 