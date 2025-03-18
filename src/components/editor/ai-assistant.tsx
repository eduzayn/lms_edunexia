"use client"

import { useState } from "react"
import { Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface AIAssistantProps {
  onGenerate: (content: string) => void
}

export function AIAssistant({ onGenerate }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleGenerate = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Erro ao gerar conteúdo")
      }

      const data = await response.json()
      onGenerate(data.content)
      setIsOpen(false)
      setPrompt("")
      toast({
        title: "Conteúdo gerado com sucesso!",
        description: "O conteúdo foi inserido no editor.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o conteúdo. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Wand2 className="h-4 w-4 mr-2" />
          Assistente IA
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assistente de IA</DialogTitle>
          <DialogDescription>
            Descreva o que você quer que eu gere para você.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Ex: Gere um texto sobre educação a distância..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleGenerate} disabled={!prompt || isLoading}>
            {isLoading ? "Gerando..." : "Gerar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 