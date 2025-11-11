import { type ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { CommandPalette } from '@/components/shared/CommandPalette';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout wrapper component - Clarity/Linear-inspired
 * Provides consistent page structure with sidebar and search
 */
export function Layout({ children }: LayoutProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Open command palette with Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar onSearchClick={() => setCommandPaletteOpen(true)} />
      
      <div className="flex-1 ml-60">
        {/* Main content */}
        <main className="min-h-screen overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}

