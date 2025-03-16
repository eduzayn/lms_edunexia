"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
        <Button className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Adicionar Usuário
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar usuários..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">Filtros</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Nome</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Perfil</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">Ana Silva</td>
                <td className="py-3 px-4">ana.silva@email.com</td>
                <td className="py-3 px-4">Aluno</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Ativo
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Button variant="ghost" size="sm">Editar</Button>
                </td>
              </tr>
              {/* Adicione mais linhas conforme necessário */}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 