// Type definitions for Next.js 15 page components
import { ReactNode } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      // Allow any props to be passed to components
      [key: string]: any;
    }
  }
}

declare module 'next' {
  export interface PageProps {
    children?: ReactNode;
    params?: any;
    searchParams?: any;
  }
}
