import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { GraduationCap, LogOut, User } from 'lucide-react';
import AdminSidebar from './sidebar';
import AdminBreadcrumb from './breadcrumb';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white border-b z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">EdunexIA</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <User className="h-5 w-5 mr-2" />
              <span className="font-medium">{profile?.full_name}</span>
            </Link>
            <button
              onClick={signOut}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="pl-64 pt-16">
        <header className="bg-white border-b px-8 py-4">
          <AdminBreadcrumb />
        </header>
        
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}