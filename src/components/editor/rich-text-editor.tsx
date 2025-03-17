"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"

import { EditorToolbar } from "./editor-toolbar"

interface RichTextEditorProps {
  content?: string
  placeholder?: string
  onChange?: (content: string) => void
  readOnly?: boolean
}

export function RichTextEditor({
  content = "",
  placeholder = "Comece a escrever...",
  onChange,
  readOnly = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-muted-foreground before:h-0 before:float-left before:pointer-events-none",
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  return (
    <div className="min-h-[250px] rounded-md border bg-background">
      {!readOnly && <EditorToolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none p-4"
      />
    </div>
  )
} 