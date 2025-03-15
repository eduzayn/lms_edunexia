import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function TeacherStudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meus Alunos</h1>
        <p className="text-muted-foreground">Gerencie os alunos matriculados em seus cursos</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <select className="border rounded-md p-2">
            <option>Todos os Cursos</option>
            <option>Introdução à Programação</option>
            <option>Desenvolvimento Web</option>
            <option>Banco de Dados</option>
            <option>Inteligência Artificial</option>
          </select>
          <input 
            type="text" 
            placeholder="Buscar aluno..." 
            className="border rounded-md p-2"
          />
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-md">
          Exportar Lista
        </button>
      </div>
      
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Atividade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">João Silva</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">joao.silva@exemplo.com</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Introdução à Programação</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">75%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hoje, 10:30</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link href="/teacher/students/1" className="text-indigo-600 hover:text-indigo-900">Ver</Link>
                    <Link href="/teacher/students/1/message" className="text-indigo-600 hover:text-indigo-900">Mensagem</Link>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Maria Oliveira</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">maria.oliveira@exemplo.com</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Desenvolvimento Web</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">90%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ontem, 15:45</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link href="/teacher/students/2" className="text-indigo-600 hover:text-indigo-900">Ver</Link>
                    <Link href="/teacher/students/2/message" className="text-indigo-600 hover:text-indigo-900">Mensagem</Link>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Carlos Santos</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">carlos.santos@exemplo.com</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Banco de Dados</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">45%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 dias atrás</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link href="/teacher/students/3" className="text-indigo-600 hover:text-indigo-900">Ver</Link>
                    <Link href="/teacher/students/3/message" className="text-indigo-600 hover:text-indigo-900">Mensagem</Link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Mostrando 3 de 48 alunos
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md">Anterior</button>
          <button className="px-3 py-1 bg-primary text-white rounded-md">1</button>
          <button className="px-3 py-1 border rounded-md">2</button>
          <button className="px-3 py-1 border rounded-md">3</button>
          <button className="px-3 py-1 border rounded-md">Próximo</button>
        </div>
      </div>
    </div>
  );
}
