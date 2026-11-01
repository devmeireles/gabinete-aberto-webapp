"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export type ThemeMode = "light" | "dark" | "auto";

const THEME_STORAGE_KEY = "theme";
const THEME_CHANGE_EVENT = "gabinete-theme-change";
let inMemoryTheme: ThemeMode = "auto";

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "auto";
}

function getThemeSnapshot(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    inMemoryTheme =
      saved === null ? inMemoryTheme : isThemeMode(saved) ? saved : "auto";
  } catch {
    return inMemoryTheme;
  }

  return inMemoryTheme;
}

function getServerThemeSnapshot(): ThemeMode {
  return "auto";
}

function subscribeToTheme(onChange: () => void): () => void {
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange);
}

function updateTheme(mode: ThemeMode): void {
  inMemoryTheme = mode;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Theme changes remain available even if storage is disabled.
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  if (mode === "dark") {
    root.setAttribute("data-theme", "dark");
    root.classList.add("dark");
  } else if (mode === "light") {
    root.setAttribute("data-theme", "light");
    root.classList.remove("dark");
  } else {
    root.removeAttribute("data-theme");
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}

export const ThemeToggle: React.FC = () => {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const cycleTheme = () => {
    const next: ThemeMode =
      theme === "auto" ? "dark" : theme === "dark" ? "light" : "auto";
    updateTheme(next);
  };

  const getLabel = () => {
    if (theme === "dark") return "Tema Escuro";
    if (theme === "light") return "Tema Claro";
    return "Tema Automático";
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={`Alternar tema visual (atual: ${getLabel()})`}
      title={`Alternar tema visual: ${getLabel()}`}
      className="inline-flex items-center gap-1.5 rounded border border-border bg-surface p-2 text-xs font-medium text-text-muted transition-colors hover:bg-surface-hover hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
    >
      {theme === "dark" ? (
        <Moon className="h-4 w-4 text-accent" aria-hidden="true" />
      ) : theme === "light" ? (
        <Sun className="h-4 w-4 text-accent" aria-hidden="true" />
      ) : (
        <Monitor className="h-4 w-4 text-text-muted" aria-hidden="true" />
      )}
      <span className="hidden font-sans text-[11px] lg:inline">
        {theme === "dark" ? "Escuro" : theme === "light" ? "Claro" : "Auto"}
      </span>
    </button>
  );
};
