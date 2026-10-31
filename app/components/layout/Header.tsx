"use client";

import React, { Suspense, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export type NavTab =
  "/" | "/deputados" | "/despesas" | "/partidos" | "/comparar" | "/sobre";

export const Header = () => {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderContent />
    </Suspense>
  );
};

const HeaderFallback = () => (
  <header className="sticky top-0 z-30 border-b border-border bg-surface">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <span className="text-base font-bold text-text sm:text-lg">
        Gabinete Aberto
      </span>
    </div>
  </header>
);

const HeaderContent = () => {
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
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <span
          onClick={() => handleNavClick("/")}
          aria-label="Ir para a página inicial"
          className="shrink-0 rounded text-left text-base font-bold tracking-tight whitespace-nowrap text-text transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring sm:text-lg"
        >
          Gabinete Aberto
        </span>

        {/* Desktop navigation */}
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-6 text-sm font-medium md:flex"
        >
          {navItems.map((item) => {
            const active = isActive(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 border-b-2 py-1 text-xs font-semibold tracking-wider whitespace-nowrap uppercase transition-colors ${
                  active
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
        <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
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
            className="rounded p-2 text-text-muted hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navegação móvel"
          className="space-y-1 border-t border-border bg-surface px-4 py-3 md:hidden"
        >
          {navItems.map((item) => {
            const active = isActive(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={active ? "page" : undefined}
                className={`w-full rounded px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary-soft font-semibold text-primary"
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
