import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-red-600" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Acesso não autorizado
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Você não tem permissão para acessar esta página.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}