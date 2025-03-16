import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Administrativo | EdunexIA LMS",
  description: "Área administrativa da plataforma EdunexIA LMS",
};

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 