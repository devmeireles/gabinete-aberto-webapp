"use client";

import React, { useState } from 'react';
import { Menu, X, Download, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export type NavTab = 'overview' | 'deputies' | 'expenses' | 'parties' | 'compare' | 'about';

interface HeaderProps {
  // currentTab: NavTab;
  // onNavigate: (tab: NavTab) => void;
  // onExportCsv?: () => void;
  // lastUpdatedStr?: string;
}

export const Header: React.FC<HeaderProps> = ({
  // currentTab,
  // onNavigate,
  // onExportCsv,
  // lastUpdatedStr,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: NavTab; label: string }> = [
    { id: 'overview', label: 'Visão geral' },
    { id: 'deputies', label: 'Deputados' },
    { id: 'expenses', label: 'Despesas' },
    { id: 'parties', label: 'Partidos' },
    { id: 'compare', label: 'Comparar' },
    { id: 'about', label: 'Sobre os dados' },
  ];

  const handleNavClick = (tab: NavTab) => {
    // onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      {/* 3-zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('overview')}
          className="text-left font-bold text-base sm:text-lg tracking-tight text-[var(--color-text)] whitespace-nowrap shrink-0 hover:text-[var(--color-primary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] rounded"
        >
          <span>Gabinete Aberto</span>
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--color-text-muted)]"
        >
          {navItems.map((item) => {
            const isActive = false;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-xs uppercase tracking-wider font-semibold ${
                  isActive
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + theme toggle */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = false;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
