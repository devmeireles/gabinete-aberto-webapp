"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export type NavTab =
  | "/"
  | "/deputados"
  | "/despesas"
  | "/partidos"
  | "/comparar"
  | "/sobre";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const navItems: Array<{ id: NavTab; label: string }> = [
    { id: "/", label: "Visão geral" },
    { id: "/deputados", label: "Deputados" },
    { id: "/despesas", label: "Despesas" },
    { id: "/partidos", label: "Partidos" },
    { id: "/comparar", label: "Comparar" },
    { id: "/sobre", label: "Sobre os dados" },
  ];

  const handleNavClick = (path: NavTab) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: NavTab) => pathname === path;

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">

        {/* Logo */}
        <span
          onClick={() => handleNavClick("/")}
          aria-label="Ir para a página inicial"
          className="text-left font-bold text-base sm:text-lg tracking-tight text-text whitespace-nowrap shrink-0 hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded"
        >
          Gabinete Aberto
        </span>

        {/* Desktop navigation */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {navItems.map((item) => {
            const active = isActive(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={active ? "page" : undefined}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-xs uppercase tracking-wider font-semibold ${active
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            aria-label={
              mobileMenuOpen
                ? "Fechar menu de navegação"
                : "Abrir menu de navegação"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="p-2 text-text-muted hover:text-text rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navegação móvel"
          className="md:hidden border-t border-border bg-surface px-4 py-3 space-y-1"
        >
          {navItems.map((item) => {
            const active = isActive(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={active ? "page" : undefined}
                className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium transition-colors ${active
                    ? "bg-primary-soft text-primary font-semibold"
                    : "text-text-muted hover:bg-surface-hover hover:text-text"
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};