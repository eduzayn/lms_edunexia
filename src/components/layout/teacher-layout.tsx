import React from 'react';
import { TeacherSidebar } from './teacher-sidebar';
import { TeacherBreadcrumb } from './teacher-breadcrumb';

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      <div className="flex-1">
        <TeacherBreadcrumb />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
