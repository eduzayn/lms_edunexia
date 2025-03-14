// Type definitions for Next.js 15 page components
import { ReactNode } from 'react';

declare module 'next' {
  export interface PageProps {
    children?: ReactNode;
    params?: any;
    searchParams?: any;
  }
}
