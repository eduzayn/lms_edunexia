"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import Highlight from "@tiptap/extension-highlight"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { lazy, Suspense, useState } from "react"

// Carrega componentes da UI dinamicamente
const EditorToolbar = lazy(() => import("./editor-toolbar").then(mod => ({ default: mod.EditorToolbar })))
const ImageUploadDialog = lazy(() => import("./image-upload-dialog").then(mod => ({ default: mod.ImageUploadDialog })))
const AIAssistant = lazy(() => import("./ai-assistant").then(mod => ({ default: mod.AIAssistant })))

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Comece a digitar..." }: RichTextEditorProps) {
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Highlight,
      CodeBlockLowlight.configure({
        HTMLAttributes: {
          class: "rounded-md bg-muted p-4",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const handleAIGenerate = (content: string) => {
    editor.chain().focus().insertContent(content).run()
  }

  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg border rounded-lg">
      <div className="flex items-center justify-between border-b p-2">
        <Suspense fallback={<div className="h-10 w-full animate-pulse bg-muted" />}>
          <EditorToolbar editor={editor} onImageUpload={() => setIsImageUploadOpen(true)} />
        </Suspense>
        <Suspense fallback={<div className="h-10 w-32 animate-pulse bg-muted" />}>
          <AIAssistant onGenerate={handleAIGenerate} />
        </Suspense>
      </div>
      <EditorContent editor={editor} className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none" />
      <Suspense fallback={null}>
        <ImageUploadDialog
          open={isImageUploadOpen}
          onOpenChange={setIsImageUploadOpen}
          onImageUpload={(url) => {
            editor.chain().focus().setImage({ src: url }).run()
            setIsImageUploadOpen(false)
          }}
        />
      </Suspense>
    </div>
  )
} 