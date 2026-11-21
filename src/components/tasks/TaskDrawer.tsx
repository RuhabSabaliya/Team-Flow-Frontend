'use client';

import React, { useState, useEffect } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { TaskComments } from '@/components/tasks/TaskComments';
import { StatusDropdown } from '@/components/tasks/StatusDropdown';
import { TaskStatus, TaskPriority, TaskAttachment } from '@/types/models';
import {
  X,
  Copy,
  Trash2,
  Check,
  Loader2,
  User,
  Clock,
  Paperclip,
  Upload,
  FileText,
  Download,
  Calendar,
} from 'lucide-react';

export function TaskDrawer() {
  const { currentWorkspace, selectedTask, setSelectedTask, updateTask, deleteTask, members } = useWorkspace();

  const isViewer = currentWorkspace?.role === 'viewer';
  const canEdit = !isViewer;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description || '');
      setStatus(selectedTask.status);
      setPriority(selectedTask.priority);
      setAssigneeId(selectedTask.assigneeId?.id || '');
      setDueDate(selectedTask.dueDate ? selectedTask.dueDate.slice(0, 10) : '');
      setAttachments(selectedTask.attachments || []);
    }
  }, [selectedTask]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedTask(null);
    };
    if (selectedTask) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTask, setSelectedTask]);

  if (!selectedTask) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(selectedTask.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canEdit) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateTask(selectedTask.id, {
        title,
        description,
        status,
        priority,
        assigneeId: assigneeId ? ({ id: assigneeId } as any) : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        attachments,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!canEdit) return;
    if (window.confirm(`Delete task ${selectedTask.key}?`)) {
      setIsDeleting(true);
      try {
        await deleteTask(selectedTask.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <>
      {/* Drawer Backdrop */}
      <div
        className="fixed inset-0 bg-dark-canvas/50 backdrop-blur-2xs z-40 transition-opacity duration-200"
        onClick={() => setSelectedTask(null)}
      />

      {/* Slide-Over Drawer Panel */}
      <aside
        aria-labelledby="drawer-task-title"
        className="fixed top-0 right-0 bottom-0 w-[460px] max-w-full bg-light-surface dark:bg-dark-surface-rail border-l border-light-border dark:border-dark-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-light-border-subtle dark:border-dark-border-subtle shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-sm bg-light-canvas dark:bg-dark-surface border border-light-border-subtle dark:border-dark-border font-mono text-[11px] font-medium text-light-on-surface-secondary dark:text-dark-on-surface-secondary">
              {selectedTask.key}
            </span>
            <button
              onClick={handleCopyKey}
              className="p-1 rounded text-light-muted-ink dark:text-dark-muted-ink hover:text-light-on-surface dark:hover:text-dark-on-surface transition-colors"
              title="Copy task key"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-status-done" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-1">
            {canEdit && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 rounded text-light-muted-ink dark:text-dark-muted-ink hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Delete task"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={() => setSelectedTask(null)}
              className="p-1.5 rounded text-light-muted-ink dark:text-dark-muted-ink hover:text-light-on-surface dark:hover:text-dark-on-surface transition-colors"
              title="Close drawer (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title input */}
          <div>
            <label htmlFor="drawer-task-title" className="sr-only">
              Task title
            </label>
            <input
              id="drawer-task-title"
              type="text"
              readOnly={!canEdit}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full text-base font-semibold text-light-on-surface dark:text-dark-on-surface bg-transparent border-0 border-b border-transparent hover:border-light-border dark:hover:border-dark-border focus:border-accent focus:outline-none pb-1 transition-colors"
            />
          </div>

          {/* Metadata Row: Status, Priority, Assignee */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Status with Dot */}
            <div>
              <span className="block text-[11px] font-medium text-light-on-surface-secondary dark:text-dark-on-surface-secondary mb-1">
                Status
              </span>
              <StatusDropdown
                currentStatus={status}
                onStatusChange={setStatus}
                size="md"
                disabled={!canEdit}
              />
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="drawer-task-priority"
                className="block text-[11px] font-medium text-light-on-surface-secondary dark:text-dark-on-surface-secondary mb-1"
              >
                Priority
              </label>
              <select
                id="drawer-task-priority"
                disabled={!canEdit}
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full text-xs px-2.5 py-1.5 rounded bg-light-surface-rail dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:border-accent capitalize disabled:opacity-75 disabled:cursor-not-allowed"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="none">None</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label
                htmlFor="drawer-task-assignee"
                className="block text-[11px] font-medium text-light-on-surface-secondary dark:text-dark-on-surface-secondary mb-1 flex items-center gap-1"
              >
                <User className="w-3 h-3" />
                Assignee
              </label>
              <select
                id="drawer-task-assignee"
                disabled={!canEdit}
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded bg-light-surface-rail dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:border-accent disabled:opacity-75 disabled:cursor-not-allowed"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.user.id} value={m.user.id}>
                    {m.user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="drawer-task-due"
                className="block text-[11px] font-medium text-light-on-surface-secondary dark:text-dark-on-surface-secondary mb-1 flex items-center gap-1"
              >
                <Calendar className="w-3 h-3" />
                Due Date
              </label>
              <input
                id="drawer-task-due"
                type="date"
                disabled={!canEdit}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs px-2.5 py-1 rounded bg-light-surface-rail dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:border-accent disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="drawer-task-desc"
              className="block text-[11px] font-medium text-light-on-surface-secondary dark:text-dark-on-surface-secondary mb-1"
            >
              Description
            </label>
            <textarea
              id="drawer-task-desc"
              rows={4}
              readOnly={!canEdit}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={canEdit ? 'Add more details to this issue...' : 'No description provided.'}
              className="w-full text-xs p-2.5 rounded bg-light-surface-rail dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-on-surface dark:text-dark-on-surface placeholder:text-light-muted-ink dark:placeholder:text-dark-muted-ink focus:outline-none focus:border-accent leading-relaxed resize-y"
            />
          </div>

          {/* Attachments Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-light-on-surface-secondary dark:text-dark-on-surface-secondary flex items-center gap-1">
                <Paperclip className="w-3 h-3" />
                Attachments ({attachments.length})
              </span>
              {canEdit && (
                <label className="cursor-pointer text-[11px] text-accent hover:underline flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Attach file</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>

            {attachments.length > 0 && (
              <div className="space-y-1.5">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 rounded bg-light-surface-rail dark:bg-dark-surface border border-light-border-subtle dark:border-dark-border text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-light-muted-ink dark:text-dark-muted-ink shrink-0" />
                      <span className="truncate text-light-on-surface dark:text-dark-on-surface">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-light-muted-ink dark:text-dark-muted-ink shrink-0">
                        ({Math.round(file.size / 1024)} KB)
                      </span>
                    </div>
                    <a
                      href={file.url}
                      download={file.name}
                      className="p-1 text-light-muted-ink dark:text-dark-muted-ink hover:text-accent transition-colors shrink-0"
                      title="Download attachment"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments Feed */}
          <TaskComments taskId={selectedTask.id} />
        </div>

        {/* Drawer Footer Actions */}
        {canEdit && (
          <footer className="flex items-center justify-between px-6 py-3 border-t border-light-border-subtle dark:border-dark-border-subtle bg-light-surface-rail dark:bg-dark-surface shrink-0">
            <div>
              {saveSuccess && (
                <span className="text-xs text-status-done flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Saved
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-3 py-1.5 rounded text-xs text-light-on-surface-secondary dark:text-dark-on-surface-secondary hover:bg-light-canvas dark:hover:bg-dark-surface-rail transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSave()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white bg-light-primary dark:bg-dark-primary hover:bg-accent disabled:opacity-50 transition-colors shadow-xs"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save changes
              </button>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}
