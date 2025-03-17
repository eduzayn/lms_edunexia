import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MaterialList } from '@/components/materials/material-list'

export const metadata: Metadata = {
  title: 'Materiais | EdunexIA LMS',
  description: 'Acesse materiais e recursos para parceiros',
}

export default function PartnerMaterialsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Materiais</h1>
        <p className="text-muted-foreground mt-2">
          Acesse materiais e recursos para parceiros
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Materiais Disponíveis</CardTitle>
            <CardDescription>
              Acesse materiais de marketing, guias e documentação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MaterialList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 