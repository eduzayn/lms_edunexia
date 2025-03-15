import React from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminBreadcrumb } from "@/components/layout/admin-breadcrumb";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <AdminBreadcrumb />
          {children}
        </div>
      </div>
    </div>
  );
}
