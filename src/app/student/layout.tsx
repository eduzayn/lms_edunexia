import React from "react";
import { StudentSidebar } from "@/components/layout/student-sidebar";
import { StudentBreadcrumb } from "@/components/layout/student-breadcrumb";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <StudentSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <StudentBreadcrumb />
          {children}
        </div>
      </div>
    </div>
  );
}
