'use client';

import React, { useState, useEffect } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { X, Settings, Trash2, Loader2, Check, Lock, AlertTriangle, AlertCircle, Shield } from 'lucide-react';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSettingsModal({ isOpen, onClose }: ProjectSettingsModalProps) {
  const { currentWorkspace, currentProject, updateProject, deleteProject } = useWorkspace();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Danger Zone state
  const [confirmKey, setConfirmKey] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (currentProject) {
      setName(currentProject.name);
      setDescription(currentProject.description || '');
      setConfirmKey('');
      setError(null);
      setDeleteError(null);
    }
  }, [currentProject, isOpen]);

  if (!isOpen || !currentProject) return null;

  const isViewer = currentWorkspace?.role === 'viewer';
  const canEdit = !isViewer;
  const canDelete = currentWorkspace?.role === 'owner' || currentWorkspace?.role === 'admin';
  const isKeyConfirmed = confirmKey.trim().toUpperCase() === currentProject.key.toUpperCase();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !canEdit) return;

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      await updateProject(currentProject.id, {
        name: name.trim(),
        description: description.trim() || undefined
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update project settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isKeyConfirmed || isDeleting || !canDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteProject(currentProject.id);
      onClose();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete project');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-2xs p-4 animate-in fade-in-50 duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-lg shadow-xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-dark-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Project Settings</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-surface-rail text-slate-600 dark:text-slate-400 font-medium">
              {currentProject.key}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* General Settings Form */}
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="p-2.5 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Project Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Project name
              </label>
              <input
                type="text"
                required
                disabled={!canEdit}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs bg-white dark:bg-dark-surface-rail border border-slate-200 dark:border-dark-border rounded px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            {/* Immutable Project Key */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Project key
                </label>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Immutable
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  disabled
                  value={currentProject.key}
                  className="w-24 text-xs font-mono font-semibold bg-slate-100 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded px-3 py-2 text-slate-500 cursor-not-allowed uppercase"
                />
                <span className="text-[11px] text-slate-400">
                  Used as the prefix for all task IDs (e.g. {currentProject.key}-1).
                </span>
              </div>
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                disabled={!canEdit}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this project about?"
                className="w-full text-xs bg-white dark:bg-dark-surface-rail border border-slate-200 dark:border-dark-border rounded px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            {canEdit ? (
              <div className="flex items-center justify-between pt-2">
                <div>
                  {saveSuccess && (
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Project updated
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSaving || !name.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save changes
                </button>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-dark-surface-rail rounded border border-slate-200 dark:border-dark-border text-xs text-slate-500 flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Viewers have read-only access to project settings.</span>
              </div>
            )}
          </form>

          {/* Danger Zone (Owner / Admin) */}
          {canDelete && (
            <div className="pt-4 border-t border-slate-200 dark:border-dark-border">
              <div className="p-4 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded space-y-3">
                <div className="flex items-start gap-2 text-red-900 dark:text-red-300">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-semibold">Danger Zone</h3>
                    <p className="text-[11px] text-red-700 dark:text-red-400 mt-0.5 leading-relaxed">
                      Deleting this project will permanently delete all tasks, boards, and history in it. This action cannot be undone.
                    </p>
                  </div>
                </div>

                {deleteError && (
                  <div className="p-2 rounded bg-red-100/80 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-[11px] text-red-800 dark:text-red-200">
                    {deleteError}
                  </div>
                )}

                <div className="space-y-1.5 pt-1">
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400">
                    To confirm deletion, type <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentProject.key}</span> below:
                  </label>
                  <input
                    type="text"
                    value={confirmKey}
                    onChange={(e) => setConfirmKey(e.target.value)}
                    placeholder={currentProject.key}
                    className="w-full text-xs font-mono uppercase bg-white dark:bg-dark-surface border border-red-200 dark:border-red-800 rounded px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={!isKeyConfirmed || isDeleting}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Delete project
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-dark-surface-rail flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-surface-rail transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
