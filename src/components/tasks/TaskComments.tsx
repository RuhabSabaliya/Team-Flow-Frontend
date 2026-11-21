'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useWorkspace } from '@/context/WorkspaceContext';
import { apiClient } from '@/lib/api';
import { TaskComment } from '@/types/models';
import { MessageSquare, Send, Trash2, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';

interface TaskCommentsProps {
  taskId: string;
}

export function TaskComments({ taskId }: TaskCommentsProps) {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const isViewer = currentWorkspace?.role === 'viewer';
  const canComment = !isViewer;

  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!currentWorkspace || !taskId) return;
    try {
      const data = await apiClient<TaskComment[]>(
        `/workspaces/${currentWorkspace.id}/tasks/${taskId}/comments`
      );
      setComments(data);
    } catch (err: any) {
      console.error('Failed to load comments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace, taskId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canComment || !newComment.trim() || !currentWorkspace) return;

    setIsPosting(true);
    setError(null);

    try {
      const created = await apiClient<TaskComment>(
        `/workspaces/${currentWorkspace.id}/tasks/${taskId}/comments`,
        {
          method: 'POST',
          body: JSON.stringify({ content: newComment.trim() })
        }
      );
      setComments((prev) => [...prev, created]);
      setNewComment('');
    } catch (err: any) {
      setError(err.message || 'Failed to post comment');
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentWorkspace || !canComment) return;
    setDeletingId(commentId);
    try {
      await apiClient(
        `/workspaces/${currentWorkspace.id}/tasks/${taskId}/comments/${commentId}`,
        {
          method: 'DELETE'
        }
      );
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete comment');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-dark-border">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
          Discussion
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-dark-surface text-slate-600 dark:text-slate-400 font-medium">
            {comments.length}
          </span>
        </h4>
      </div>

      {error && (
        <div className="p-2.5 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="py-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
          Loading discussion...
        </div>
      ) : comments.length === 0 ? (
        <div className="py-4 text-center text-xs text-slate-400">
          No comments yet.
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => {
            const isAuthor = comment.userId?.id === user?.id;
            const canDelete =
              !isViewer &&
              (isAuthor || currentWorkspace?.role === 'owner' || currentWorkspace?.role === 'admin');
            const isDeleting = deletingId === comment.id;

            return (
              <div
                key={comment.id}
                className="p-3 bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                      {comment.userId?.name ? comment.userId.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {comment.userId?.name || 'User'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString()}{' '}
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={isDeleting}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete comment"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed pl-7">
                  {comment.content}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Comment Input or Viewer Notice */}
      {canComment ? (
        <form onSubmit={handlePostComment} className="space-y-2 pt-2">
          <textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Leave a comment or update..."
            className="w-full text-xs p-2.5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-sans"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPosting || !newComment.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-xs"
            >
              {isPosting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="p-2.5 bg-slate-50 dark:bg-dark-surface rounded border border-slate-200 dark:border-dark-border text-xs text-slate-500 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Viewers have read-only access and cannot post comments.</span>
        </div>
      )}
    </div>
  );
}
