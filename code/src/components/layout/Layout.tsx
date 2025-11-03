import { type ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout wrapper component - Linear-inspired minimalist
 * Provides consistent page structure with navbar and generous spacing
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className="mx-auto max-w-[1600px] px-12 py-8 pt-24">
        {children}
      </main>
    </div>
  );
}

