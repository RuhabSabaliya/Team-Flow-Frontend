'use client';

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { TaskPriority } from '@/types/models';
import { Search, X, Filter, RotateCcw } from 'lucide-react';

interface TaskFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  priorityFilter: TaskPriority | 'all';
  onPriorityChange: (p: TaskPriority | 'all') => void;
  creatorFilter: string;
  onCreatorChange: (creatorId: string) => void;
  totalTasks: number;
  filteredTasksCount: number;
  onReset: () => void;
}

export function TaskFilterBar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  creatorFilter,
  onCreatorChange,
  totalTasks,
  filteredTasksCount,
  onReset,
}: TaskFilterBarProps) {
  const { members } = useWorkspace();

  const isFiltered =
    searchQuery.trim() !== '' || priorityFilter !== 'all' || creatorFilter !== 'all';

  return (
        <div className="px-6 py-2.5 bg-light-surface dark:bg-dark-surface-rail border-b border-light-border dark:border-dark-border flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Search Input & Selectors */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 max-w-xs min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-light-muted-ink dark:text-dark-muted-ink pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Filter issues by key, title..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-light-surface-rail dark:bg-dark-surface border border-light-border dark:border-dark-border rounded text-light-on-surface dark:text-dark-on-surface placeholder:text-light-muted-ink dark:placeholder:text-dark-muted-ink focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-light-muted-ink dark:text-dark-muted-ink hover:text-light-on-surface dark:hover:text-dark-on-surface p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

              {/* Priority Filter */ }
              < div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-light-muted-ink dark:text-dark-muted-ink shrink-0" />
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
              className="bg-light-surface-rail dark:bg-dark-surface border border-light-border dark:border-dark-border rounded px-2.5 py-1.5 text-xs text-light-on-surface dark:text-dark-on-surface font-medium focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="all">All priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="none">None</option>
            </select>
        </div>

        {/* Member filter */}
          {members.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <select
                value={creatorFilter}
                onChange={(e) => onCreatorChange(e.target.value)}
                className="bg-light-surface-rail dark:bg-dark-surface border border-light-border dark:border-dark-border rounded px-2.5 py-1.5 text-xs text-light-on-surface dark:text-dark-on-surface font-medium focus:outline-none focus:border-accent cursor-pointer max-w-[150px] truncate"
              >
                <option value="all">All members</option>
                {members.map((m) => (
                  <option key={m.user.id} value={m.user.id}>
                    {m.user.name}
                  </option>
                ))}
              </select>
            </div>
          )}
    </div>

      {/* Stats & Reset */ }
  <div className="flex items-center gap-3 text-xs">
    {isFiltered ? (
      <>
        <span className="text-[11px] font-mono text-light-muted-ink dark:text-dark-muted-ink">
          Showing <span className="font-semibold text-light-on-surface dark:text-dark-on-surface">{filteredTasksCount}</span> of {totalTasks}
        </span>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[11px] text-accent font-medium hover:underline transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset filters
        </button>
      </>
    ) : (
      <span className="text-[11px] font-mono text-light-muted-ink dark:text-dark-muted-ink">
        {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
      </span>
    )}
  </div>
    </div >
  );
}
