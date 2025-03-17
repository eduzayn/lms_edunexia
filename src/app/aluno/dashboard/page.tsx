import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard do Aluno | EdunexIA',
  description: 'Painel de controle com informações e atividades do aluno'
}

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Cursos Ativos</h3>
          <p className="mt-2 text-3xl font-bold">3</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Progresso Geral</h3>
          <p className="mt-2 text-3xl font-bold">75%</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Certificados</h3>
          <p className="mt-2 text-3xl font-bold">2</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Atividades Pendentes</h3>
          <p className="mt-2 text-3xl font-bold">5</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Próximas Aulas</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Matemática Avançada</p>
                  <p className="text-sm text-muted-foreground">
                    Prof. João Silva • 14:00
                  </p>
                </div>
                <button className="text-primary hover:underline">
                  Acessar
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Física Quântica</p>
                  <p className="text-sm text-muted-foreground">
                    Prof. Maria Santos • 16:00
                  </p>
                </div>
                <button className="text-primary hover:underline">
                  Acessar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Atividades Recentes</h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="font-medium">Questionário enviado</p>
                <p className="text-sm text-muted-foreground">
                  Matemática Avançada • há 2 horas
                </p>
              </div>
              <div>
                <p className="font-medium">Aula assistida</p>
                <p className="text-sm text-muted-foreground">
                  Física Quântica • há 3 horas
                </p>
              </div>
              <div>
                <p className="font-medium">Fórum respondido</p>
                <p className="text-sm text-muted-foreground">
                  Matemática Avançada • há 5 horas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 