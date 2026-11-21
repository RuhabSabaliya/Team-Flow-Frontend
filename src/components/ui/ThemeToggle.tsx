'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="w-8 h-8 rounded-lg bg-light-surface-rail dark:bg-dark-surface-rail animate-pulse" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-on-surface-secondary dark:text-dark-on-surface-secondary hover:text-light-on-surface dark:hover:text-dark-on-surface hover:border-accent transition-colors"
    >
      {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
    </button>
  );
}
