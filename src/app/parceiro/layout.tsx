import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'

const navItems = [
  {
    title: 'Dashboard',
    href: '/parceiro/dashboard',
    icon: 'dashboard',
  },
  {
    title: 'Indicações',
    href: '/parceiro/indicacoes',
    icon: 'users',
  },
  {
    title: 'Comissões',
    href: '/parceiro/comissoes',
    icon: 'dollar-sign',
  },
  {
    title: 'Materiais',
    href: '/parceiro/materiais',
    icon: 'file-text',
  },
  {
    title: 'Configurações',
    href: '/parceiro/configuracoes',
    icon: 'settings',
  },
]

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar navItems={navItems} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  )
} 