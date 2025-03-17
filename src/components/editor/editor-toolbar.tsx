"use client"

import { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image,
  RotateCcw,
  RotateCw,
} from "lucide-react"

import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EditorToolbarProps {
  editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="border border-input bg-transparent rounded-t-md p-1">
      <div className="flex flex-wrap gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("code")}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1" />

        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1" />

        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1" />

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "justify" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("justify").run()
          }
        >
          <AlignJustify className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-1" />

        <Popover>
          <PopoverTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive("link")}>
              <Link className="h-4 w-4" />
            </Toggle>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <Input
                id="url"
                placeholder="Cole o link aqui"
                type="url"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editor
                      .chain()
                      .focus()
                      .setLink({ href: e.currentTarget.value })
                      .run()
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => editor.chain().focus().unsetLink().run()}
                >
                  Remover Link
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    const input = document.querySelector(
                      "#url"
                    ) as HTMLInputElement
                    if (input.value) {
                      editor
                        .chain()
                        .focus()
                        .setLink({ href: input.value })
                        .run()
                    }
                  }}
                >
                  Adicionar Link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Dialog>
          <DialogTrigger asChild>
            <Toggle size="sm">
              <Image className="h-4 w-4" />
            </Toggle>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Imagem</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      const file = e.target.files[0]
                      const reader = new FileReader()
                      reader.onload = () => {
                        if (typeof reader.result === "string") {
                          editor
                            .chain()
                            .focus()
                            .setImage({ src: reader.result })
                            .run()
                        }
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Input
                  id="url"
                  placeholder="Ou cole o link da imagem aqui"
                  type="url"
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector(
                      "#url"
                    ) as HTMLInputElement
                    if (input.value) {
                      editor
                        .chain()
                        .focus()
                        .setImage({ src: input.value })
                        .run()
                    }
                  }}
                >
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Separator orientation="vertical" className="mx-1" />

        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 