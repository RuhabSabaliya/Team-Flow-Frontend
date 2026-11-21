'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useTheme } from 'next-themes';
import { CreateWorkspaceModal } from '@/components/modals/CreateWorkspaceModal';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { ManageMembersModal } from '@/components/modals/ManageMembersModal';
import { WorkspaceSettingsModal } from '@/components/modals/WorkspaceSettingsModal';
import { UserProfileModal } from '@/components/modals/UserProfileModal';
import { CommandMenu } from '@/components/navigation/CommandMenu';
import {
  ChevronDown,
  Plus,
  LogOut,
  Users,
  Settings,
  Search,
  Sun,
  Moon,
  FolderKanban,
  Check,
  SlidersHorizontal,
} from 'lucide-react';

export function TopBar() {
  const { user, logout } = useAuth();
  const {
    workspaces,
    currentWorkspace,
    selectWorkspace,
    projects,
    currentProject,
    selectProject,
  } = useWorkspace();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);

  const wsRef = useRef<HTMLDivElement>(null);
  const projRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wsRef.current && !wsRef.current.contains(e.target as Node)) {
        setIsWorkspaceOpen(false);
      }
      if (projRef.current && !projRef.current.contains(e.target as Node)) {
        setIsProjectOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDark = mounted && theme === 'dark';
  const isViewer = currentWorkspace?.role === 'viewer';
  const canCreateTask = !isViewer;
  const canCreateProject = !isViewer;

  return (
    <>
      <header className="sticky top-0 z-30 bg-light-surface-rail dark:bg-dark-surface-rail border-b border-light-border dark:border-dark-border px-5 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Workspace & Integrated Project Switcher */}
          <div className="flex items-center gap-3">
            {/* App Icon + Workspace Switcher */}
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary inline-flex items-center justify-center font-bold text-xs shadow-xs tracking-tight">
                TF
              </span>

              {/* Workspace Switcher */}
              <div ref={wsRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded hover:bg-light-canvas dark:hover:bg-dark-surface transition-colors text-xs font-semibold text-light-on-surface dark:text-dark-on-surface"
                >
                  <span className="truncate max-w-[140px]">
                    {currentWorkspace?.name || 'Workspace'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-light-on-surface-secondary dark:text-dark-on-surface-secondary" />
                </button>

                {isWorkspaceOpen && (
                  <div className="absolute left-0 mt-1 w-64 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border shadow-xl p-1 z-40">
                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-light-muted-ink dark:text-dark-muted-ink">
                      Workspaces
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-0.5">
                      {workspaces.map((ws) => (
                        <button
                          key={ws.id}
                          onClick={() => {
                            selectWorkspace(ws);
                            setIsWorkspaceOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center justify-between transition-colors ${
                            ws.id === currentWorkspace?.id
                              ? 'bg-status-todo-bg-light dark:bg-status-todo-bg-dark text-status-todo-text-light dark:text-status-todo-text-dark font-medium'
                              : 'text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-rail dark:hover:bg-dark-surface-rail'
                          }`}
                        >
                          <span className="truncate">{ws.name}</span>
                          <span className="text-[10px] uppercase opacity-60">
                            {ws.role}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-1 mt-1 border-t border-light-border-subtle dark:border-dark-border-subtle">
                      <button
                        onClick={() => {
                          setIsWorkspaceOpen(false);
                          setIsSettingsModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-light-on-surface-secondary dark:text-dark-on-surface-secondary hover:bg-light-surface-rail dark:hover:bg-dark-surface-rail rounded font-medium flex items-center gap-1.5"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Workspace settings
                      </button>
                      <button
                        onClick={() => {
                          setIsWorkspaceOpen(false);
                          setIsCreateModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-accent hover:bg-status-todo-bg-light dark:hover:bg-status-todo-bg-dark rounded font-medium flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Create workspace
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <span className="text-light-border dark:text-dark-border text-sm" aria-hidden="true">
              /
            </span>

            {/* Active Project Switcher */}
            <div ref={projRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProjectOpen(!isProjectOpen)}
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-accent transition-colors"
              >
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-status-todo-bg-light dark:bg-status-todo-bg-dark text-status-todo-text-light dark:text-status-todo-text-dark font-mono text-[11px] font-semibold">
                  {currentProject?.key || 'TF'}
                </span>
                <span className="font-semibold text-xs text-light-on-surface dark:text-dark-on-surface truncate max-w-[160px]">
                  {currentProject?.name || 'Select project'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-light-on-surface-secondary dark:text-dark-on-surface-secondary" />
              </button>

              {isProjectOpen && (
                <div className="absolute left-0 mt-1 w-64 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border shadow-xl p-1 z-40">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-light-muted-ink dark:text-dark-muted-ink">
                    Projects
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-0.5">
                    {projects.map((proj) => {
                      const isSelected = proj.id === currentProject?.id;
                      return (
                        <button
                          key={proj.id}
                          onClick={() => {
                            selectProject(proj);
                            setIsProjectOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-status-todo-bg-light dark:bg-status-todo-bg-dark text-status-todo-text-light dark:text-status-todo-text-dark font-medium'
                              : 'text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-rail dark:hover:bg-dark-surface-rail'
                          }`}
                        >
                          <span className="inline-flex items-center gap-2 truncate">
                            <span className="font-mono text-[10px] text-light-on-surface-secondary dark:text-dark-on-surface-secondary">
                              {proj.key}
                            </span>
                            <span className="truncate">{proj.name}</span>
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {canCreateProject && (
                    <div className="pt-1 mt-1 border-t border-light-border-subtle dark:border-dark-border-subtle">
                      <button
                        onClick={() => {
                          setIsProjectOpen(false);
                          setIsCreateProjectModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-accent hover:bg-status-todo-bg-light dark:hover:bg-status-todo-bg-dark rounded font-medium flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add new project
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Active Sprint Pill */}
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 bg-light-surface dark:bg-dark-surface border border-light-border-subtle dark:border-dark-border-subtle">
              <span className="w-1.5 h-1.5 rounded-full bg-status-done shrink-0" />
              <span className="text-[10px] font-medium text-light-on-surface-secondary dark:text-dark-on-surface-secondary">
                Sprint 24
              </span>
            </span>
          </div>

          {/* Right: Search, Filter, Theme Toggle & Action CTA */}
          <div className="flex items-center gap-2">
            {/* Quick Command Trigger / Search */}
            <button
              onClick={() => setIsCommandMenuOpen(true)}
              className="relative hidden sm:flex items-center justify-between w-48 md:w-56 pl-8 pr-2 py-1.5 rounded bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-xs text-light-muted-ink dark:text-dark-muted-ink hover:border-accent transition-colors text-left"
            >
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <span className="truncate">Filter issues...</span>
              <kbd className="font-mono text-[10px] px-1 py-0.2 rounded bg-light-surface-rail dark:bg-dark-surface-rail border border-light-border dark:border-dark-border">
                ⌘K
              </kbd>
            </button>

            {/* Manage Members */}
            {currentWorkspace && (
              <button
                onClick={() => setIsMembersModalOpen(true)}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:bg-light-canvas dark:hover:bg-dark-surface-rail text-xs font-medium text-light-on-surface dark:text-dark-on-surface transition-colors"
                title="Manage workspace members"
              >
                <Users className="w-3.5 h-3.5 text-light-on-surface-secondary dark:text-dark-on-surface-secondary" />
                <span>Members</span>
              </button>
            )}

            {/* Theme Toggle Button (Light/Dark) */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center justify-center w-8 h-8 rounded bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-on-surface-secondary dark:text-dark-on-surface-secondary hover:text-light-on-surface dark:hover:text-dark-on-surface hover:border-accent transition-colors"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Primary New Task CTA */}
            {canCreateTask && (
              <button
                onClick={() => setIsCreateTaskModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary hover:bg-accent font-medium text-xs transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">New Task</span>
              </button>
            )}

            {/* User Profile / Logout */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-7 h-7 rounded-full bg-light-primary dark:bg-dark-primary text-white font-bold text-xs flex items-center justify-center shrink-0 ml-1 shadow-xs"
              title="Account settings"
            >
              {user?.name.charAt(0).toUpperCase()}
            </button>

            <button
              onClick={() => logout()}
              title="Sign out"
              className="p-1.5 rounded text-light-muted-ink dark:text-dark-muted-ink hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
      />
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
      />
      <ManageMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
      />
      <WorkspaceSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        onOpenTaskModal={() => setIsCreateTaskModalOpen(true)}
        onOpenProjectModal={() => setIsCreateProjectModalOpen(true)}
        onOpenMembersModal={() => setIsMembersModalOpen(true)}
        onOpenWorkspaceModal={() => setIsSettingsModalOpen(true)}
      />
    </>
  );
}
