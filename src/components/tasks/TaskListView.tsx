'use client';

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { StatusDropdown } from '@/components/tasks/StatusDropdown';
import { Task, TaskPriority } from '@/types/models';
import { Calendar } from 'lucide-react';

interface TaskListViewProps {
  tasks: Task[];
  isFiltered: boolean;
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; badge: string }> = {
  urgent: { label: 'Urgent', badge: 'text-red-700 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800' },
  high: { label: 'High', badge: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
  medium: { label: 'Medium', badge: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' },
  low: { label: 'Low', badge: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
  none: { label: 'None', badge: 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
};

export function TaskListView({ tasks, isFiltered }: TaskListViewProps) {
  const { setSelectedTask, updateTaskStatus } = useWorkspace();

  if (tasks.length === 0) {
    return (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-light-surface dark:bg-dark-surface">
            <p className="text-sm text-light-on-surface-secondary dark:text-dark-on-surface-secondary mb-1">
              {isFiltered ? 'No tasks match your filters.' : 'No tasks in this project.'}
            </p>
              <p className="text-xs text-light-muted-ink dark:text-dark-muted-ink">
                {isFiltered ? 'Try clearing or adjusting search filters.' : 'Click "New task" to create the first issue.'}
              </p>
          </div>
          );
  }

          return (
            <div className="flex-1 overflow-y-auto bg-light-surface dark:bg-dark-surface">
              <table className="w-full text-left border-collapse text-xs">
                {/* Table Header */}
                <thead>
                    <tr className="border-b border-light-border dark:border-dark-border bg-light-surface-rail dark:bg-dark-surface-rail text-[11px] font-semibold text-light-on-surface-secondary dark:text-dark-on-surface-secondary uppercase tracking-wider sticky top-0 z-10">
                      <th className="py-2.5 px-4 w-24">Key</th>
                      <th className="py-2.5 px-4">Title</th>
                      <th className="py-2.5 px-4 w-40">Status</th>
                      <th className="py-2.5 px-4 w-28">Priority</th>
                      <th className="py-2.5 px-4 w-36">Assignee</th>
                      <th className="py-2.5 px-4 w-32">Due Date</th>
                    </tr>
                </thead>

                {/* Table Body */}
                  <tbody className="divide-y divide-light-border-subtle dark:divide-dark-border-subtle">
                    {tasks.map((task) => {
                      const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.none;

                      return (
                        <tr
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className="hover:bg-light-canvas dark:hover:bg-dark-surface-rail cursor-pointer transition-colors group"
                        >
                          {/* Key */}
                            <td className="py-3 px-4 font-mono font-medium text-light-on-surface-secondary dark:text-dark-on-surface-secondary group-hover:text-accent">
                              {task.key}
                            </td>

                            {/* Title & Description */}
                            <td className="py-3 px-4 min-w-[200px]">
                                <div className="font-semibold text-light-on-surface dark:text-dark-on-surface line-clamp-1">
                                  {task.title}
                                </div>
                                {task.description && (
                                    <div className="text-[11px] text-light-muted-ink dark:text-dark-muted-ink truncate max-w-md">
                                      {task.description}
                                    </div>
                  )}
                                  </td>

                                {/* Status Switcher with Dot Dropdown */}
                                <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                  <StatusDropdown
                                    currentStatus={task.status}
                                    onStatusChange={(status) => updateTaskStatus(task.id, status)}
                                    size="sm"
                                  />
                                </td>

                                {/* Priority */}
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded border tracking-wider ${priorityCfg.badge}`}
                                  >
                                    {priorityCfg.label}
                                  </span>
                                </td>

                                {/* Assignee */}
                                <td className="py-3 px-4">
                                  {task.assigneeId ? (
                                        <div className="flex items-center gap-1.5 text-light-on-surface dark:text-dark-on-surface font-medium truncate">
                                          <div className="w-5 h-5 rounded-full bg-light-primary dark:bg-dark-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                                            {task.assigneeId.name.charAt(0).toUpperCase()}
                                          </div>
                                          <span className="truncate">{task.assigneeId.name}</span>
                                        </div>
                                        ) : (
                                        <span className="text-light-muted-ink dark:text-dark-muted-ink font-normal">Unassigned</span>
                  )}
                                      </td>

                                      {/* Due Date */}
                                        <td className="py-3 px-4 text-light-muted-ink dark:text-dark-muted-ink font-mono text-[11px]">
                                          {task.dueDate ? (
                                            <span className="flex items-center gap-1">
                                              <Calendar className="w-3 h-3 text-light-muted-ink dark:text-dark-muted-ink shrink-0" />
                                              {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                          ) : (
                    <span className="text-light-border dark:text-dark-border">—</span>
                                          )}
                                        </td>
                                      </tr>
                                      );
          })}
                                    </tbody>
      </table>
                              </div>
                              );
}
