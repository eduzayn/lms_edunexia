"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Video, Book } from "lucide-react";

export default function ContentListPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Conteúdo</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Conteúdo
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar conteúdo..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">Filtros</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card de Conteúdo */}
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Introdução à Programação</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Material didático sobre conceitos básicos de programação.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Book className="w-4 h-4" />
                  <span>Curso de Programação</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Card de Vídeo */}
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Video className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Aula 1 - Variáveis</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Videoaula sobre tipos de variáveis em programação.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Book className="w-4 h-4" />
                  <span>Curso de Programação</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Adicione mais cards conforme necessário */}
        </div>
      </Card>
    </div>
  );
} 