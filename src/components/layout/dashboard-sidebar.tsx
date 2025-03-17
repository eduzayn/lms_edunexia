'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  Settings,
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: string
}

interface DashboardSidebarProps {
  navItems: NavItem[]
}

const iconMap = {
  dashboard: LayoutDashboard,
  users: Users,
  'dollar-sign': DollarSign,
  'file-text': FileText,
  settings: Settings,
}

export function DashboardSidebar({ navItems }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r bg-background">
      <div className="h-16 border-b flex items-center px-6">
        <Link href="/" className="font-bold text-xl">
          EdunexIA LMS
        </Link>
      </div>
      <div className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap]
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start',
                    pathname === item.href && 'bg-muted'
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
} 