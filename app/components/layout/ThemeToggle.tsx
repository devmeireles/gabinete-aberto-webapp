"use client";

import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'auto';

export const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<ThemeMode>('auto');

    useEffect(() => {
        try {
            const saved = localStorage.getItem('theme') as ThemeMode;
            if (saved && ['light', 'dark', 'auto'].includes(saved)) {
                setTheme(saved);
                applyTheme(saved);
            } else {
                // Check system preference
                applyTheme('auto');
            }
        } catch {
            applyTheme('auto');
        }
    }, []);

    const applyTheme = (mode: ThemeMode) => {
        const root = document.documentElement;
        if (mode === 'dark') {
            root.setAttribute('data-theme', 'dark');
            root.classList.add('dark');
        } else if (mode === 'light') {
            root.setAttribute('data-theme', 'light');
            root.classList.remove('dark');
        } else {
            root.removeAttribute('data-theme');
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    };

    const cycleTheme = () => {
        let next: ThemeMode;
        if (theme === 'auto') {
            // If currently auto, switch to explicit dark
            next = 'dark';
        } else if (theme === 'dark') {
            next = 'light';
        } else {
            next = 'auto';
        }

        setTheme(next);
        applyTheme(next);
        try {
            localStorage.setItem('theme', next);
        } catch {
            // Ignore
        }
    };

    const getLabel = () => {
        if (theme === 'dark') return 'Tema Escuro';
        if (theme === 'light') return 'Tema Claro';
        return 'Tema Automático';
    };

    return (
        <button
            type="button"
            onClick={cycleTheme}
            aria-label={`Alternar tema visual (atual: ${getLabel()})`}
            title={`Alternar tema visual: ${getLabel()}`}
            className="inline-flex items-center gap-1.5 p-2 rounded border border-border bg-surface text-text-muted hover:text-text hover:bg-surface-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring text-xs font-medium"
        >
            {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-accent" aria-hidden="true" />
            ) : theme === 'light' ? (
                <Sun className="w-4 h-4 text-accent" aria-hidden="true" />
            ) : (
                <Monitor className="w-4 h-4 text-text-muted" aria-hidden="true" />
            )}
            <span className="hidden lg:inline text-[11px] font-sans">
                {theme === 'dark' ? 'Escuro' : theme === 'light' ? 'Claro' : 'Auto'}
            </span>
        </button>
    );
};
