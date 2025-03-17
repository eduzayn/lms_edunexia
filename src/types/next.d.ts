// Type definitions for Next.js 15 page components
import { ReactNode } from 'react';
import type { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'

// @ts-nocheck
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      // Allow any props to be passed to components
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }
  }
}

declare module 'next' {
  export interface PageProps {
    children?: ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchParams?: any;
  }
}

declare module 'next/headers' {
  function cookies(): RequestCookies
}
