'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TaskStatus } from '@/types/models';
import { ChevronDown, Check } from 'lucide-react';

export const STATUS_META: Record<
  TaskStatus,
  {
    label: string;
    stage: 'stage-todo' | 'stage-progress' | 'stage-done';
    dotClass: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  todo: {
    label: 'To Do',
    stage: 'stage-todo',
    dotClass: 'bg-status-todo',
    badgeBg: 'bg-status-todo-bg-light dark:bg-status-todo-bg-dark',
    badgeText: 'text-status-todo-text-light dark:text-status-todo-text-dark',
  },
  on_hold: {
    label: 'On Hold',
    stage: 'stage-todo',
    dotClass: 'bg-status-on-hold',
    badgeBg: 'bg-status-on-hold-bg-light dark:bg-status-on-hold-bg-dark',
    badgeText: 'text-status-on-hold-text-light dark:text-status-on-hold-text-dark',
  },
  backlog: {
    label: 'Backlog',
    stage: 'stage-todo',
    dotClass: 'bg-status-backlog',
    badgeBg: 'bg-status-backlog-bg-light dark:bg-status-backlog-bg-dark',
    badgeText: 'text-status-backlog-text-light dark:text-status-backlog-text-dark',
  },
  in_progress: {
    label: 'In Progress',
    stage: 'stage-progress',
    dotClass: 'bg-status-in-progress',
    badgeBg: 'bg-status-in-progress-bg-light dark:bg-status-in-progress-bg-dark',
    badgeText: 'text-status-in-progress-text-light dark:text-status-in-progress-text-dark',
  },
  in_review: {
    label: 'In QA / Review',
    stage: 'stage-progress',
    dotClass: 'bg-status-in-qa',
    badgeBg: 'bg-status-in-qa-bg-light dark:bg-status-in-qa-bg-dark',
    badgeText: 'text-status-in-qa-text-light dark:text-status-in-qa-text-dark',
  },
  done: {
    label: 'Done',
    stage: 'stage-done',
    dotClass: 'bg-status-done',
    badgeBg: 'bg-status-done-bg-light dark:bg-status-done-bg-dark',
    badgeText: 'text-status-done-text-light dark:text-status-done-text-dark',
  },
  canceled: {
    label: 'Closed / Canceled',
    stage: 'stage-done',
    dotClass: 'bg-status-closed',
    badgeBg: 'bg-status-closed-bg-light dark:bg-status-closed-bg-dark',
    badgeText: 'text-status-closed-text-light dark:text-status-closed-text-dark',
  },
};

export const STAGES = [
  {
    id: 'stage-todo',
    title: 'To Do & On Hold',
    dotClass: 'bg-status-todo',
    dropLabel: 'Drop task here to move to To Do',
    defaultStatus: 'todo' as TaskStatus,
    statuses: ['todo', 'on_hold', 'backlog'] as TaskStatus[],
  },
  {
    id: 'stage-progress',
    title: 'In Progress & QA',
    dotClass: 'bg-status-in-progress',
    dropLabel: 'Drop task here to move to In Progress',
    defaultStatus: 'in_progress' as TaskStatus,
    statuses: ['in_progress', 'in_review'] as TaskStatus[],
  },
  {
    id: 'stage-done',
    title: 'Done & Closed',
    dotClass: 'bg-status-done',
    dropLabel: 'Drop task here to move to Done',
    defaultStatus: 'done' as TaskStatus,
    statuses: ['done', 'canceled'] as TaskStatus[],
  },
];

interface StatusDropdownProps {
  currentStatus: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export function StatusDropdown({
  currentStatus,
  onStatusChange,
  size = 'sm',
  disabled = false,
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const meta = STATUS_META[currentStatus] || STATUS_META.todo;

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (disabled) {
    return (
      <div className="inline-block text-left" onClick={(e) => e.stopPropagation()}>
        <span
          className={`inline-flex items-center gap-1.5 rounded bg-light-surface-rail dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-on-surface dark:text-dark-on-surface opacity-75 cursor-default ${
            size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs'
          }`}
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dotClass}`} />
          <span className="font-medium whitespace-nowrap">{meta.label}</span>
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-left"
      onClick={(e) => e.stopPropagation()} // Stop drawer open when clicking dropdown
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-1.5 rounded bg-light-surface-rail dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-accent text-light-on-surface dark:text-dark-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-120 ${
          size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs'
        }`}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dotClass}`} />
        <span className="font-medium whitespace-nowrap">{meta.label}</span>
        <ChevronDown className="w-3 h-3 text-light-on-surface-secondary dark:text-dark-on-surface-secondary shrink-0" />
      </button>

      {isOpen && (
        <ul
          role="menu"
          className="absolute left-0 mt-1 w-56 rounded-lg bg-light-surface dark:bg-dark-surface-rail border border-light-border dark:border-dark-border shadow-xl p-1 z-50 animate-in fade-in-50 duration-100"
        >
          {STAGES.map((stage, idx) => (
            <React.Fragment key={stage.id}>
              {idx > 0 && (
                <li
                  role="separator"
                  className="my-1 border-t border-light-border-subtle dark:border-dark-border-subtle"
                />
              )}
              <li role="presentation" className="px-1.5 pt-1.5 pb-0.5">
                <span className="block px-1 pb-1 text-[11px] font-medium text-light-on-surface-secondary dark:text-dark-on-surface-secondary">
                  {stage.title}
                </span>
                <ul role="group" className="space-y-0.5">
                  {stage.statuses.map((stKey) => {
                    const st = STATUS_META[stKey];
                    const isSelected = stKey === currentStatus;

                    return (
                      <li
                        key={stKey}
                        role="menuitem"
                        onClick={() => {
                          onStatusChange(stKey);
                          setIsOpen(false);
                        }}
                        className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors duration-100 text-xs ${
                          isSelected
                            ? 'bg-light-surface-rail dark:bg-dark-surface font-medium'
                            : 'hover:bg-light-surface-rail dark:hover:bg-dark-surface text-light-on-surface dark:text-dark-on-surface'
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${st.dotClass}`}
                          />
                          <span className="text-light-on-surface dark:text-dark-on-surface">
                            {st.label}
                          </span>
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
}
