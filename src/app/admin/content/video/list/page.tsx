import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Filter, Clock, Calendar, Eye, Trash2 } from "lucide-react";

export default function VideoListPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Link
          href="/admin/content"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para Conteúdo</span>
        </Link>
      </div>
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vídeos</h1>
          <p className="text-muted-foreground">
            Gerencie os vídeos educacionais da plataforma
          </p>
        </div>
        
        <Link
          href="/admin/content/video"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Vídeo</span>
        </Link>
      </div>
      
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar vídeos..."
              className="w-full pl-9 pr-3 py-2 border rounded-md"
            />
          </div>
        </div>
        
        <div>
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-2 border rounded-md hover:bg-muted"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {/* Video Card 1 */}
          <div className="border rounded-md overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://storage.googleapis.com/edunexia-videos/thumbnails/sample-thumbnail.jpg"
                alt="Introdução à Fotossíntese"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                3:15
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-1 line-clamp-1">Introdução à Fotossíntese</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                Uma explicação detalhada sobre o processo de fotossíntese e sua importância para os ecossistemas.
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>14/03/2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>3:15</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Link
                  href="/admin/content/video/1"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs border rounded hover:bg-muted"
                >
                  <Eye className="h-3 w-3" />
                  <span>Visualizar</span>
                </Link>
                
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs border rounded text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Video Card 2 */}
          <div className="border rounded-md overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://storage.googleapis.com/edunexia-videos/thumbnails/sample-thumbnail.jpg"
                alt="Equações Diferenciais"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                4:30
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-1 line-clamp-1">Equações Diferenciais: Aplicações Práticas</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                Aprenda como as equações diferenciais são aplicadas em problemas do mundo real.
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>12/03/2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>4:30</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Link
                  href="/admin/content/video/2"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs border rounded hover:bg-muted"
                >
                  <Eye className="h-3 w-3" />
                  <span>Visualizar</span>
                </Link>
                
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs border rounded text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Video Card 3 */}
          <div className="border rounded-md overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://storage.googleapis.com/edunexia-videos/thumbnails/sample-thumbnail.jpg"
                alt="História da Revolução Industrial"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                5:45
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-1 line-clamp-1">História da Revolução Industrial</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                Uma análise das causas e consequências da Revolução Industrial para a sociedade moderna.
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>10/03/2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>5:45</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Link
                  href="/admin/content/video/3"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs border rounded hover:bg-muted"
                >
                  <Eye className="h-3 w-3" />
                  <span>Visualizar</span>
                </Link>
                
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs border rounded text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando 3 de 12 vídeos
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 border rounded-md hover:bg-muted disabled:opacity-50"
            disabled
          >
            Anterior
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-primary text-primary-foreground rounded-md"
          >
            1
          </button>
          <button
            type="button"
            className="px-3 py-1 border rounded-md hover:bg-muted"
          >
            2
          </button>
          <button
            type="button"
            className="px-3 py-1 border rounded-md hover:bg-muted"
          >
            3
          </button>
          <button
            type="button"
            className="px-3 py-1 border rounded-md hover:bg-muted"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
