import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import CertificateService from '@/lib/services/certificate-service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const hash = searchParams.get('hash');
  
  if (!hash) {
    return NextResponse.json(
      { error: 'Código de verificação não fornecido' },
      { status: 400 }
    );
  }
  
  try {
    const certificateService = CertificateService.getInstance();
    const certificate = await certificateService.verifyCertificate(hash);
    
    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificado não encontrado' },
        { status: 404 }
      );
    }
    
    // Check if certificate is revoked
    if (certificate.metadata && (certificate.metadata as any).revoked) {
      return NextResponse.json(
        { 
          error: 'Certificado revogado',
          certificate,
          revocation_reason: (certificate.metadata as any).revocation_reason,
          revocation_date: (certificate.metadata as any).revocation_date
        },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ certificate });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar certificado' },
      { status: 500 }
    );
  }
}
