'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useWorkspace } from '@/context/WorkspaceContext';
import { AuthLoadingScreen } from '@/components/auth/AuthLoadingScreen';
import { TopBar } from '@/components/navigation/TopBar';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { CreateWorkspaceModal } from '@/components/modals/CreateWorkspaceModal';
import { Building, Plus, Layers, FolderKanban, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const { workspaces, isLoadingWorkspaces } = useWorkspace();
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  // Show skeleton while verifying session
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  // 1. Unauthenticated View (Clean landing & sign-in invitation)
  if (!user) {
    return (
        <div className="min-h-screen flex flex-col bg-light-canvas dark:bg-dark-canvas text-light-on-surface dark:text-dark-on-surface">
          <header className="border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface-rail">
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary inline-flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
                  TF
                </span>
                <span className="font-semibold text-base tracking-tight">TeamFlow</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-medium text-light-on-surface-secondary dark:text-dark-on-surface-secondary hover:text-light-on-surface dark:hover:text-dark-on-surface px-3 py-1.5 rounded transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-semibold px-3 py-1.5 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary hover:bg-accent transition-colors shadow-xs"
                >
                  Create account
                </Link>
              </div>
            </div>
          </header>

            <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
              <div className="max-w-2xl mb-12">
                <h1 className="text-4xl font-semibold tracking-tight text-light-on-surface dark:text-dark-on-surface mb-4">
                  Engineering issue tracking with zero clutter.
                </h1>
                <p className="text-lg text-light-on-surface-secondary dark:text-dark-on-surface-secondary leading-relaxed mb-6">
                  TeamFlow provides fast, high-density issue boards with multi-tenant workspace isolation. Built strictly for engineering teams.
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary hover:bg-accent transition-colors shadow-xs"
                  >
                    Get started
                  </Link>
                  <Link
                    href="/login"
                    className="px-5 py-2.5 rounded-lg text-sm font-medium bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-rail dark:hover:bg-dark-surface-rail transition-colors"
                  >
                    Sign in
                  </Link>
                </div>
              </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-light-border dark:border-dark-border">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-light-on-surface dark:text-dark-on-surface">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Tenant isolation
            </div>
            <p className="text-xs text-light-on-surface-secondary dark:text-dark-on-surface-secondary leading-relaxed">
              Every request enforces verified workspace membership. Zero cross-tenant data leakage.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-light-on-surface dark:text-dark-on-surface">
              <Layers className="w-4 h-4 text-accent" />
              Dual-token auth
            </div>
            <p className="text-xs text-light-on-surface-secondary dark:text-dark-on-surface-secondary leading-relaxed">
              HttpOnly cookies for web browsers and Bearer token fallback for testing and CLI clients.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-light-on-surface dark:text-dark-on-surface">
              <FolderKanban className="w-4 h-4 text-accent" />
              Structured issue keys
            </div>
            <p className="text-xs text-light-on-surface-secondary dark:text-dark-on-surface-secondary leading-relaxed">
              Human-friendly sequential project keys (TF-1, TF-2) with atomic safety in MongoDB.
            </p>
          </div>
        </div>
      </main>
      </div >
    );
  }

    // 2. Authenticated but 0 Workspaces (Onboarding Invitation)
    if (!isLoadingWorkspaces && workspaces.length === 0) {
      return (
          <div className="min-h-screen flex flex-col bg-light-canvas dark:bg-dark-canvas text-light-on-surface dark:text-dark-on-surface">
            <TopBar />
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="max-w-md w-full bg-light-surface dark:bg-dark-surface p-8 rounded-xl border border-light-border dark:border-dark-border shadow-md space-y-4">
                <div className="w-12 h-12 rounded-xl bg-status-todo-bg-light dark:bg-status-todo-bg-dark text-accent flex items-center justify-center mx-auto">
                  <Building className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">Create your first workspace</h2>
                <p className="text-xs text-light-on-surface-secondary dark:text-dark-on-surface-secondary leading-relaxed">
                  Workspaces are shared company spaces where your team organizes projects, issues, and members.
                </p>
                <button
                  onClick={() => setIsWorkspaceModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded text-xs font-semibold bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary hover:bg-accent transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Create workspace
                </button>
              </div>
            </main>

          <CreateWorkspaceModal
            isOpen={isWorkspaceModalOpen}
            onClose={() => setIsWorkspaceModalOpen(false)}
          />
        </div>
      );
    }

    // 3. Authenticated Active Workspace Dashboard (Full-width, zero left rail sidebar)
    return (
      <div className="min-h-screen flex flex-col bg-light-canvas dark:bg-dark-canvas text-light-on-surface dark:text-dark-on-surface overflow-hidden">
        <TopBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <KanbanBoard />
        </div>
      </div>
    );
  }
