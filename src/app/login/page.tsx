'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AlertCircle, Loader2 } from 'lucide-react';

function SvgEye({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function SvgEyeSlash({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();
    try {
      await login({ email, password });
      router.push('/');
    } catch {
      // Error handled via AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-light-canvas dark:bg-dark-canvas text-light-on-surface dark:text-dark-on-surface selection:bg-blue-600/20 px-4 py-6 transition-colors">
      {/* Top Header Bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between pb-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm tracking-tight flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
            TF
          </span>
          <span className="font-bold text-base tracking-tight text-light-on-surface dark:text-dark-on-surface">
            TeamFlow
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md mx-auto my-auto">
        <div className="rounded-xl p-7 sm:p-8 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border shadow-xl shadow-slate-900/5 dark:shadow-black/40 space-y-6 animate-in fade-in-50 zoom-in-95 duration-150">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-light-on-surface dark:text-dark-on-surface">
              Welcome back
            </h1>
            <p className="mt-1 text-xs text-light-on-surface-secondary dark:text-dark-on-surface-secondary">
              Sign in to access your projects, tasks, and workspaces.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg flex items-start gap-2.5 text-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-light-on-surface-secondary dark:text-dark-on-surface-secondary"
              >
                Work email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full px-3 py-2 rounded-lg text-xs bg-light-surface-rail dark:bg-dark-surface-rail border border-light-border dark:border-dark-border text-light-on-surface dark:text-dark-on-surface placeholder:text-light-muted-ink dark:placeholder:text-dark-muted-ink focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-light-on-surface-secondary dark:text-dark-on-surface-secondary"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-9 py-2 rounded-lg text-xs bg-light-surface-rail dark:bg-dark-surface-rail border border-light-border dark:border-dark-border text-light-on-surface dark:text-dark-on-surface placeholder:text-light-muted-ink dark:placeholder:text-dark-muted-ink focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-light-muted-ink dark:text-dark-muted-ink hover:text-light-on-surface dark:hover:text-dark-on-surface p-0.5 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <SvgEyeSlash /> : <SvgEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !email.trim() || !password}
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="pt-2 text-center text-xs text-light-on-surface-secondary dark:text-dark-on-surface-secondary">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 ml-0.5"
            >
              Create one
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto text-center pt-4 text-[11px] text-light-muted-ink dark:text-dark-muted-ink">
        TeamFlow — Fast, multi-tenant engineering task management
      </footer>
    </div>
  );
}
