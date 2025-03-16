import React from 'react';
import { StudentSidebar } from './student-sidebar';
import { StudentBreadcrumb } from './student-breadcrumb';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-1">
        <StudentBreadcrumb />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
