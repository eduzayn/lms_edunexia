import React from "react";
import { TeacherSidebar } from "@/components/layout/teacher-sidebar";
import { TeacherBreadcrumb } from "@/components/layout/teacher-breadcrumb";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <TeacherSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <TeacherBreadcrumb />
          {children}
        </div>
      </div>
    </div>
  );
}
