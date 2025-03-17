'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getMaterials } from '@/app/actions/materials'

interface Material {
  id: string
  title: string
  description: string
  file_url: string
  created_at: string
}

export function MaterialList() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadMaterials() {
      try {
        const result = await getMaterials()

        if (!result.data) {
          toast.error('Erro ao carregar materiais')
          return
        }

        setMaterials(result.data)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Erro ao carregar materiais')
      } finally {
        setIsLoading(false)
      }
    }

    loadMaterials()
  }, [])

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Carregando materiais...
      </div>
    )
  }

  if (materials.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhum material encontrado
      </div>
    )
  }

  return (
    <div className="divide-y">
      {materials.map((material) => (
        <div
          key={material.id}
          className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-muted p-2">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-medium">{material.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {material.description}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <a href={material.file_url} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download {material.title}</span>
            </a>
          </Button>
        </div>
      ))}
    </div>
  )
} 