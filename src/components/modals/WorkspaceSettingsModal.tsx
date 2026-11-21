'use client';

import React, { useState, useEffect } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { X, Building, Trash2, Loader2, Check, AlertTriangle, AlertCircle, Shield } from 'lucide-react';

interface WorkspaceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspaceSettingsModal({ isOpen, onClose }: WorkspaceSettingsModalProps) {
  const { currentWorkspace, updateWorkspace, deleteWorkspace } = useWorkspace();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Danger Zone state
  const [confirmSlug, setConfirmSlug] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (currentWorkspace) {
      setName(currentWorkspace.name);
      setSlug(currentWorkspace.slug);
      setConfirmSlug('');
      setError(null);
      setDeleteError(null);
    }
  }, [currentWorkspace, isOpen]);

  if (!isOpen || !currentWorkspace) return null;

  const canEdit = currentWorkspace.role === 'owner' || currentWorkspace.role === 'admin';
  const isOwner = currentWorkspace.role === 'owner';
  const isSlugConfirmed = confirmSlug.trim().toLowerCase() === currentWorkspace.slug.toLowerCase();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      await updateWorkspace({
        name: name.trim(),
        slug: slug.trim().toLowerCase() || undefined
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update workspace settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isSlugConfirmed || isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteWorkspace(currentWorkspace.id);
      onClose();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete workspace');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-2xs p-4 animate-in fade-in-50 duration-150">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg shadow-xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900">Workspace Settings</h2>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 tracking-wider">
              {currentWorkspace.role}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* General Settings Form */}
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="p-2.5 rounded bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Workspace Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workspace name
              </label>
              <input
                type="text"
                required
                disabled={!canEdit}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>

            {/* Workspace Slug */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL slug
              </label>
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-2 rounded-l border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-xs font-mono">
                  /
                </span>
                <input
                  type="text"
                  required
                  disabled={!canEdit}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 text-xs font-mono bg-white border border-slate-200 rounded-r px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Unique identifier used in URLs. Only lowercase letters, numbers, and hyphens.
              </p>
            </div>

            {canEdit ? (
              <div className="flex items-center justify-between pt-2">
                <div>
                  {saveSuccess && (
                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Workspace updated
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSaving || !name.trim() || !slug.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save changes
                </button>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <span>You need Admin or Owner permissions to change workspace settings.</span>
              </div>
            )}
          </form>

          {/* Danger Zone (Owner Only) */}
          {isOwner && (
            <div className="pt-4 border-t border-slate-200">
              <div className="p-4 bg-red-50/50 border border-red-200 rounded space-y-3">
                <div className="flex items-start gap-2 text-red-900">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-semibold">Danger Zone</h3>
                    <p className="text-[11px] text-red-700 mt-0.5 leading-relaxed">
                      Deleting this workspace is permanent and irreversible. All projects, tasks, comments, and member associations will be erased.
                    </p>
                  </div>
                </div>

                {deleteError && (
                  <div className="p-2 rounded bg-red-100/80 border border-red-300 text-[11px] text-red-800">
                    {deleteError}
                  </div>
                )}

                <div className="space-y-1.5 pt-1">
                  <label className="block text-[11px] text-slate-600">
                    To confirm deletion, type <span className="font-mono font-bold text-slate-800">{currentWorkspace.slug}</span> below:
                  </label>
                  <input
                    type="text"
                    value={confirmSlug}
                    onChange={(e) => setConfirmSlug(e.target.value)}
                    placeholder={currentWorkspace.slug}
                    className="w-full text-xs font-mono bg-white border border-red-200 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={!isSlugConfirmed || isDeleting}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Delete workspace
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
