import React from 'react';
import { useAuth } from '@/contexts/auth';
import { useSearchParams } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuth();
  const [verifying, setVerifying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (token) {
      setVerifying(true);
      verifyEmail(token)
        .then(({ error }) => {
          if (error) {
            setError(error.message);
          } else {
            setSuccess(true);
          }
        })
        .finally(() => setVerifying(false));
    }
  }, [token]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verificando seu email...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="flex flex-col items-center">
          <Mail className="h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {success ? 'Email verificado!' : 'Verifique seu email'}
          </h2>
          
          {error ? (
            <div className="mt-4 bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ) : success ? (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Seu email foi verificado com sucesso. Você já pode fazer login.
              </p>
              <a
                href="/auth/login"
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Fazer login
              </a>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Enviamos um link de verificação para seu email.
                Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}