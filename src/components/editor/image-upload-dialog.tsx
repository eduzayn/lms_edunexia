"use client"

import { useState } from 'react'
import { Upload, X } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImageUpload: (url: string) => void
}

export function ImageUploadDialog({ open, onOpenChange, onImageUpload }: ImageUploadDialogProps) {
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0]
      setFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlUpload = () => {
    if (imageUrl) {
      onImageUpload(imageUrl)
      setImageUrl('')
    }
  }

  const handleClose = () => {
    setImageUrl('')
    setFile(null)
    setPreview(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Imagem</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image">Upload de arquivo</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image-url">Ou cole o link da imagem aqui</Label>
            <Input
              id="image-url"
              placeholder="Cole o link da imagem aqui"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image-file">Ou faça upload de um arquivo</Label>
            <div className="grid gap-4">
              <label
                htmlFor="image-file"
                className={cn(
                  'flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed',
                  'hover:bg-muted/50',
                  preview && 'border-0'
                )}
              >
                {preview ? (
                  <div className="relative w-full">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mx-auto max-h-[200px] w-auto rounded-lg object-contain"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute right-2 top-2"
                      onClick={(e) => {
                        e.preventDefault()
                        setFile(null)
                        setPreview(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">
                      Arraste uma imagem ou clique para fazer upload
                    </div>
                  </div>
                )}
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleUrlUpload}
            disabled={(!imageUrl && !file) || isUploading}
          >
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 