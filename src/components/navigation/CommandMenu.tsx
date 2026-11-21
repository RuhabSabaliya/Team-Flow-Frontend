'use client';

import React, { useState, useEffect } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Task, Project } from '@/types/models';
import {
  Search,
  Plus,
  Users,
  Building,
  FolderKanban,
  FileText,
  X,
  Command,
  ArrowRight
} from 'lucide-react';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTaskModal: () => void;
  onOpenProjectModal: () => void;
  onOpenMembersModal: () => void;
  onOpenWorkspaceModal: () => void;
}

export function CommandMenu({
  isOpen,
  onClose,
  onOpenTaskModal,
  onOpenProjectModal,
  onOpenMembersModal,
  onOpenWorkspaceModal
}: CommandMenuProps) {
  const { projects, selectProject, tasks, setSelectedTask } = useWorkspace();
  const [query, setQuery] = useState('');

  // Handle Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredProjects = projects.filter(
    (p) => p.name.toLowerCase().includes(q) || p.key.toLowerCase().includes(q)
  );

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.key.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-2xs p-4 animate-in fade-in-50 duration-100">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tasks & projects..."
            className="w-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3 text-xs">
          {/* Quick Actions */}
          <div>
            <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Actions
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenTaskModal();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                  <span>Create new task</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-300" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenProjectModal();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
                  <span>Create new project</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-300" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenMembersModal();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Manage workspace members</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-300" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenWorkspaceModal();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Workspace settings</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-300" />
              </button>
            </div>
          </div>

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Projects ({filteredProjects.length})
              </div>
              <div className="space-y-0.5">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      selectProject(p);
                      onClose();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        {p.key}
                      </span>
                      <span className="truncate">{p.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Switch project</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Tasks ({filteredTasks.length})
              </div>
              <div className="space-y-0.5">
                {filteredTasks.slice(0, 10).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTask(t);
                      onClose();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] text-blue-600 font-semibold">
                        {t.key}
                      </span>
                      <span className="truncate">{t.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 capitalize">{t.status.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Tip: Press <kbd className="font-mono bg-white border border-slate-200 px-1 py-0.5 rounded">Ctrl</kbd> + <kbd className="font-mono bg-white border border-slate-200 px-1 py-0.5 rounded">K</kbd> anywhere</span>
          <span>TeamFlow Command Bar</span>
        </div>
      </div>
    </div>
  );
}
