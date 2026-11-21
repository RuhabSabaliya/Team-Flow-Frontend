'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AlertCircle, Loader2 } from 'lucide-react';

// Custom inline SVG for Tick / Checkmark
function SvgTick({ className = 'w-3.5 h-3.5 text-emerald-500' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Custom inline SVG for Cross / X
function SvgCross({ className = 'w-3.5 h-3.5 text-red-500' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 0 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Eye icons for show/hide password
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

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live password requirements
  const passwordChecks = useMemo(() => [
    { id: 'len', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'upper', label: 'One uppercase letter (A–Z)', met: /[A-Z]/.test(password) },
    { id: 'lower', label: 'One lowercase letter (a–z)', met: /[a-z]/.test(password) },
    { id: 'num', label: 'One number (0–9)', met: /[0-9]/.test(password) },
    { id: 'special', label: 'One special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(password) },
  ], [password]);

  const allRulesMet = useMemo(() => {
    return passwordChecks.every((check) => check.met);
  }, [passwordChecks]);

  const passwordsMatch = useMemo(() => {
    return password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  }, [password, confirmPassword]);

  const canSubmit = allRulesMet && passwordsMatch && name.trim().length >= 2 && email.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!allRulesMet) {
      setValidationError('Please satisfy all password requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match. Please re-enter your password confirmation.');
      return;
    }

    setIsSubmitting(true);
    clearError();
    try {
      await register({ name, email, password });
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

      {/* Main Form Center Card */}
      <main className="w-full max-w-md mx-auto my-auto">
        <div className="rounded-xl p-7 sm:p-8 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border shadow-xl shadow-slate-900/5 dark:shadow-black/40 space-y-6 animate-in fade-in-50 zoom-in-95 duration-150">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-light-on-surface dark:text-dark-on-surface">
              Create your account
            </h1>
            <p className="mt-1 text-xs text-light-on-surface-secondary dark:text-dark-on-surface-secondary">
              Start collaborating with projects, issues, and cycles in TeamFlow.
            </p>
          </div>

          {(error || validationError) && (
            <div className="p-3 rounded-lg flex items-start gap-2.5 text-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span className="leading-relaxed">{validationError || error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-light-on-surface-secondary dark:text-dark-on-surface-secondary"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Developer"
                className="w-full px-3 py-2 rounded-lg text-xs bg-light-surface-rail dark:bg-dark-surface-rail border border-light-border dark:border-dark-border text-light-on-surface dark:text-dark-on-surface placeholder:text-light-muted-ink dark:placeholder:text-dark-muted-ink focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
              />
            </div>

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
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-light-on-surface-secondary dark:text-dark-on-surface-secondary"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
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

              {/* Dynamic Interactive Password Checklist UI with SVG Icons */}
              <div className="mt-2.5 p-3 rounded-lg border bg-light-surface-rail/60 dark:bg-dark-surface-rail/60 border-light-border-subtle dark:border-dark-border-subtle text-xs space-y-1.5">
                <div className="font-semibold text-[10px] uppercase tracking-wider text-light-muted-ink dark:text-dark-muted-ink mb-1">
                  Password Requirements
                </div>
                {passwordChecks.map((check) => (
                  <div key={check.id} className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center shrink-0">
                      {check.met ? <SvgTick /> : <SvgCross className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />}
                    </span>
                    <span
                      className={`text-[11px] transition-colors ${
                        check.met
                          ? 'text-light-on-surface dark:text-dark-on-surface line-through opacity-70'
                          : 'text-light-on-surface-secondary dark:text-dark-on-surface-secondary'
                      }`}
                    >
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password (Two-time confirmation) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-semibold text-light-on-surface-secondary dark:text-dark-on-surface-secondary"
                >
                  Confirm password
                </label>
                {confirmPassword.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium">
                    {passwordsMatch ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <SvgTick className="w-3.5 h-3.5 text-emerald-500" />
                        Passwords match
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <SvgCross className="w-3.5 h-3.5 text-red-500" />
                        Does not match
                      </span>
                    )}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-3 pr-9 py-2 rounded-lg text-xs bg-light-surface-rail dark:bg-dark-surface-rail border text-light-on-surface dark:text-dark-on-surface placeholder:text-light-muted-ink dark:placeholder:text-dark-muted-ink focus:outline-none focus:ring-2 focus:border-transparent transition-colors font-mono ${
                    confirmPassword.length > 0 && !passwordsMatch
                      ? 'border-red-400 focus:ring-red-500'
                      : 'border-light-border dark:border-dark-border focus:ring-blue-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-light-muted-ink dark:text-dark-muted-ink hover:text-light-on-surface dark:hover:text-dark-on-surface p-0.5 transition-colors"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <SvgEyeSlash /> : <SvgEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Card Footer Switcher */}
          <div className="pt-2 text-center text-xs text-light-on-surface-secondary dark:text-dark-on-surface-secondary">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 ml-0.5"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="w-full max-w-md mx-auto text-center pt-4 text-[11px] text-light-muted-ink dark:text-dark-muted-ink">
        TeamFlow — Modern high-density project management
      </footer>
    </div>
  );
}
