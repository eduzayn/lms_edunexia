'use client'

import { StudentSidebar } from '@/components/layout/student-sidebar'
import { StudentBreadcrumb } from '@/components/layout/student-breadcrumb'

interface StudentLayoutProps {
  children: React.ReactNode
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <StudentSidebar />
      <main className="flex-1 p-8">
        <StudentBreadcrumb />
        <div className="mt-6">{children}</div>
      </main>
    </div>
  )
} 