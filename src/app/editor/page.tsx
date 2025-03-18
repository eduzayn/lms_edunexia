"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useState } from "react"

// Carrega o editor dinamicamente para reduzir o bundle inicial
const RichTextEditor = dynamic(
  () => import("@/components/editor/rich-text-editor").then(mod => mod.RichTextEditor),
  {
    loading: () => (
      <div className="min-h-[500px] w-full animate-pulse rounded-lg border bg-muted" />
    ),
    ssr: false // Desabilita SSR para o editor que é puramente client-side
  }
)

export default function EditorPage() {
  const [content, setContent] = useState("")

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Editor de Texto Rico</h1>
      <div className="space-y-4">
        <Suspense 
          fallback={
            <div className="min-h-[500px] w-full animate-pulse rounded-lg border bg-muted" />
          }
        >
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Digite seu conteúdo aqui..."
          />
        </Suspense>
        <div className="rounded-md bg-muted p-4">
          <h2 className="mb-2 text-lg font-semibold">HTML Gerado:</h2>
          <pre className="whitespace-pre-wrap text-sm">{content}</pre>
        </div>
      </div>
    </div>
  )
} 