import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { createServerSupabaseClient } from '../supabase/server';
import crypto from 'crypto';

export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  html_template: string;
  css_style: string;
  background_image_url?: string;
  created_by?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface IssuedCertificate {
  id: string;
  student_id: string;
  course_id: string;
  template_id: string;
  certificate_number: string;
  verification_hash: string;
  issue_date: string;
  expiry_date?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface VerificationLog {
  id: string;
  certificate_id?: string;
  verification_hash: string;
  verified_by?: string;
  verified_at: string;
  is_valid: boolean;
  ip_address?: string;
  user_agent?: string;
}

class CertificateService {
  private static instance: CertificateService;
  private supabaseUrl: string;
  private supabaseKey: string;
  private supabase: ReturnType<typeof createClient> | null = null;

  private constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (this.supabaseUrl && this.supabaseKey) {
      this.supabase = createClient<Database>(this.supabaseUrl, this.supabaseKey);
    }
  }

  public static getInstance(): CertificateService {
    if (!CertificateService.instance) {
      CertificateService.instance = new CertificateService();
    }
    return CertificateService.instance;
  }

  // Templates
  async getTemplates(): Promise<CertificateTemplate[]> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('certificates.templates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching certificate templates:', error);
      return [];
    }
    
    return data || [];
  }

  async getDefaultTemplate(): Promise<CertificateTemplate | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('certificates.templates')
      .select('*')
      .eq('is_default', true)
      .single();
    
    if (error) {
      console.error('Error fetching default certificate template:', error);
      return null;
    }
    
    return data;
  }

  async getTemplate(id: string): Promise<CertificateTemplate | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('certificates.templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching certificate template:', error);
      return null;
    }
    
    return data;
  }

  async createTemplate(template: Partial<CertificateTemplate>): Promise<CertificateTemplate | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('certificates.templates')
      .insert({
        name: template.name || 'Novo Template',
        description: template.description || '',
        html_template: template.html_template || '',
        css_style: template.css_style || '',
        background_image_url: template.background_image_url,
        created_by: template.created_by,
        is_default: template.is_default || false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating certificate template:', error);
      return null;
    }
    
    return data;
  }

  async updateTemplate(id: string, template: Partial<CertificateTemplate>): Promise<CertificateTemplate | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('certificates.templates')
      .update({
        name: template.name,
        description: template.description,
        html_template: template.html_template,
        css_style: template.css_style,
        background_image_url: template.background_image_url,
        is_default: template.is_default
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating certificate template:', error);
      return null;
    }
    
    return data;
  }

  // Issued Certificates
  async getStudentCertificates(studentId: string): Promise<IssuedCertificate[]> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('certificates.issued_certificates')
      .select(`
        *,
        course:academic.courses(id, name, description, hours),
        template:certificates.templates(id, name)
      `)
      .eq('student_id', studentId)
      .order('issue_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching student certificates:', error);
      return [];
    }
    
    return data || [];
  }

  async getCertificate(id: string): Promise<IssuedCertificate | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('certificates.issued_certificates')
      .select(`
        *,
        course:academic.courses(id, name, description, hours),
        template:certificates.templates(id, name, html_template, css_style, background_image_url),
        student:profiles(id, full_name, email)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching certificate:', error);
      return null;
    }
    
    return data;
  }

  async getCertificateByHash(hash: string): Promise<IssuedCertificate | null> {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('certificates.issued_certificates')
      .select(`
        *,
        course:academic.courses(id, name, description, hours),
        template:certificates.templates(id, name, html_template, css_style, background_image_url),
        student:profiles(id, full_name, email)
      `)
      .eq('verification_hash', hash)
      .single();
    
    if (error) {
      console.error('Error fetching certificate by hash:', error);
      return null;
    }
    
    return data;
  }

  async issueCertificate(studentId: string, courseId: string, templateId?: string): Promise<IssuedCertificate | null> {
    const supabase = createServerSupabaseClient();
    
    // Check if student has completed the course
    const { data: progress } = await supabase
      .from('analytics.student_progress')
      .select('progress_percentage')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .single();
    
    if (!progress || progress.progress_percentage < 100) {
      console.error('Student has not completed the course');
      return null;
    }
    
    // Check if certificate already exists
    const { data: existingCert } = await supabase
      .from('certificates.issued_certificates')
      .select('id')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .maybeSingle();
    
    if (existingCert) {
      console.log('Certificate already exists for this student and course');
      return this.getCertificate(existingCert.id);
    }
    
    // Get template
    let template;
    if (templateId) {
      template = await this.getTemplate(templateId);
    } else {
      template = await this.getDefaultTemplate();
    }
    
    if (!template) {
      console.error('No certificate template found');
      return null;
    }
    
    // Generate certificate number and verification hash
    const certificateNumber = this.generateCertificateNumber();
    const verificationHash = this.generateVerificationHash(studentId, courseId, certificateNumber);
    
    // Issue certificate
    const { data, error } = await supabase
      .from('certificates.issued_certificates')
      .insert({
        student_id: studentId,
        course_id: courseId,
        template_id: template.id,
        certificate_number: certificateNumber,
        verification_hash: verificationHash,
        issue_date: new Date().toISOString(),
        metadata: {}
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error issuing certificate:', error);
      return null;
    }
    
    return this.getCertificate(data.id);
  }

  async verifyCertificate(hash: string, verifiedBy?: string, ipAddress?: string, userAgent?: string): Promise<{ isValid: boolean; certificate: IssuedCertificate | null }> {
    const certificate = await this.getCertificateByHash(hash);
    const isValid = !!certificate;
    
    // Log verification attempt
    const supabase = createServerSupabaseClient();
    await supabase
      .from('certificates.verification_logs')
      .insert({
        certificate_id: certificate?.id,
        verification_hash: hash,
        verified_by: verifiedBy,
        is_valid: isValid,
        ip_address: ipAddress,
        user_agent: userAgent
      });
    
    return { isValid, certificate };
  }

  // Helper methods
  private generateCertificateNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CERT-${timestamp.substring(timestamp.length - 6)}-${random}`;
  }

  private generateVerificationHash(studentId: string, courseId: string, certificateNumber: string): string {
    const data = `${studentId}|${courseId}|${certificateNumber}|${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Render certificate HTML
  async renderCertificate(certificateId: string): Promise<{ html: string; css: string } | null> {
    const certificate = await this.getCertificate(certificateId);
    
    if (!certificate || !certificate.template || !certificate.student || !certificate.course) {
      return null;
    }
    
    const template = certificate.template as any;
    const student = certificate.student as any;
    const course = certificate.course as any;
    
    // Replace placeholders in template
    let html = template.html_template;
    html = html.replace(/{{student_name}}/g, student.full_name);
    html = html.replace(/{{course_name}}/g, course.name);
    html = html.replace(/{{course_hours}}/g, course.hours || '40');
    html = html.replace(/{{completion_date}}/g, new Date(certificate.issue_date).toLocaleDateString('pt-BR'));
    html = html.replace(/{{certificate_number}}/g, certificate.certificate_number);
    html = html.replace(/{{verification_url}}/g, `${process.env.NEXT_PUBLIC_BASE_URL}/verify-certificate?hash=${certificate.verification_hash}`);
    
    // Add any additional placeholders from metadata
    if (certificate.metadata) {
      Object.entries(certificate.metadata).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
      });
    }
    
    return {
      html,
      css: template.css_style
    };
  }
}

export const certificateService = CertificateService.getInstance();
export default certificateService;
