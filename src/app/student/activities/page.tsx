import * as React from "react";
import Link from "next/link";
import { Calendar, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

export default function ActivitiesListPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Atividades</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as suas atividades
        </p>
      </div>
      
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar atividades..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div>
          <select className="px-3 py-2 border rounded-md">
            <option value="">Todos os cursos</option>
            <option value="biology">Biologia</option>
            <option value="math">Matemática</option>
            <option value="history">História</option>
            <option value="physics">Física</option>
          </select>
        </div>
        
        <div>
          <select className="px-3 py-2 border rounded-md">
            <option value="">Todos os status</option>
            <option value="pending">Pendentes</option>
            <option value="completed">Concluídas</option>
            <option value="late">Atrasadas</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted/20 px-4 py-3 font-medium">
            Pendentes
          </div>
          
          <div className="divide-y">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">Fotossíntese: Processo e Importância</h3>
                  <p className="text-sm text-muted-foreground">Biologia</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Prazo: 20/03/2025</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>5 dias restantes</span>
                    </div>
                  </div>
                </div>
                
                <Link
                  href="/student/activities/1"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
                >
                  <span>Responder</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">Equações Diferenciais: Aplicações Práticas</h3>
                  <p className="text-sm text-muted-foreground">Matemática</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Prazo: 25/03/2025</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>10 dias restantes</span>
                    </div>
                  </div>
                </div>
                
                <Link
                  href="/student/activities/2"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
                >
                  <span>Responder</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted/20 px-4 py-3 font-medium">
            Concluídas com Feedback
          </div>
          
          <div className="divide-y">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">Revolução Industrial: Causas e Consequências</h3>
                  <p className="text-sm text-muted-foreground">História</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Entregue: 10/03/2025</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Nota: 8.5/10</span>
                    </div>
                  </div>
                </div>
                
                <Link
                  href="/student/activities/feedback/3"
                  className="inline-flex items-center gap-1 px-3 py-1 border text-primary rounded-md hover:bg-muted text-sm"
                >
                  <span>Ver Feedback</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">Leis de Newton: Aplicações no Cotidiano</h3>
                  <p className="text-sm text-muted-foreground">Física</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Entregue: 05/03/2025</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Nota: 9.0/10</span>
                    </div>
                  </div>
                </div>
                
                <Link
                  href="/student/activities/feedback/4"
                  className="inline-flex items-center gap-1 px-3 py-1 border text-primary rounded-md hover:bg-muted text-sm"
                >
                  <span>Ver Feedback</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando 4 de 12 atividades
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
