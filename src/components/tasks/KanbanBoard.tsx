'use client';

import React, { useState, useMemo } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { ProjectSettingsModal } from '@/components/modals/ProjectSettingsModal';
import { TaskDrawer } from '@/components/tasks/TaskDrawer';
import { TaskFilterBar } from '@/components/tasks/TaskFilterBar';
import { TaskListView } from '@/components/tasks/TaskListView';
import { StatusDropdown, STATUS_META, STAGES } from '@/components/tasks/StatusDropdown';
import { Task, TaskStatus, TaskPriority } from '@/types/models';
import { Plus, Settings, LayoutGrid, List } from 'lucide-react';

export function KanbanBoard() {
  const { currentWorkspace, currentProject, tasks, updateTaskStatus, setSelectedTask } = useWorkspace();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  const isViewer = currentWorkspace?.role === 'viewer';
  const canEdit = !isViewer;
  const canManageProject = currentWorkspace?.role === 'owner' || currentWorkspace?.role === 'admin';

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [creatorFilter, setCreatorFilter] = useState<string>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesKey = task.key.toLowerCase().includes(q);
        const matchesDesc = task.description?.toLowerCase().includes(q) || false;
        if (!matchesTitle && !matchesKey && !matchesDesc) {
          return false;
        }
      }

      // Priority Filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      // Creator Filter
      if (creatorFilter !== 'all' && task.creatorId?.id !== creatorFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, priorityFilter, creatorFilter]);

  const isFiltered =
    searchQuery.trim() !== '' || priorityFilter !== 'all' || creatorFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setPriorityFilter('all');
    setCreatorFilter('all');
  };

  const handleDrop = async (stage: typeof STAGES[number]) => {
    if (!canEdit || !draggedTaskId) return;
    const task = tasks.find((t) => t.id === draggedTaskId);
    if (!task) return;

    if (!stage.statuses.includes(task.status)) {
      await updateTaskStatus(task.id, stage.defaultStatus);
    }
    setDraggedTaskId(null);
    setDragOverStageId(null);
  };

  if (!currentProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-light-canvas dark:bg-dark-canvas">
        <p className="text-sm text-light-on-surface-secondary dark:text-dark-on-surface-secondary mb-2">
          No project selected.
        </p>
        <p className="text-xs text-light-muted-ink dark:text-dark-muted-ink">
          Select or create a project from the top bar to view issues.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden bg-light-canvas dark:bg-dark-canvas h-[calc(100vh-3.5rem)]">
        {/* Project Header Bar */}
        <div className="px-6 py-2.5 bg-light-surface dark:bg-dark-surface-rail border-b border-light-border dark:border-dark-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-light-on-surface dark:text-dark-on-surface tracking-tight">
              {currentProject.name}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-light-surface-rail dark:bg-dark-surface text-light-on-surface-secondary dark:text-dark-on-surface-secondary border border-light-border-subtle dark:border-dark-border">
              {currentProject.key}
            </span>
            {currentProject.description && (
              <span className="text-xs text-light-muted-ink dark:text-dark-muted-ink hidden md:inline truncate max-w-md">
                — {currentProject.description}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher: Board vs List */}
            <div className="flex items-center bg-light-surface-rail dark:bg-dark-surface p-0.5 rounded border border-light-border dark:border-dark-border text-xs">
              <button
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors font-medium ${
                  viewMode === 'board'
                    ? 'bg-light-surface dark:bg-dark-surface-rail text-light-on-surface dark:text-dark-on-surface shadow-2xs font-semibold'
                    : 'text-light-on-surface-secondary dark:text-dark-on-surface-secondary hover:text-light-on-surface dark:hover:text-dark-on-surface'
                }`}
                title="Kanban Board view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Board
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors font-medium ${
                  viewMode === 'list'
                    ? 'bg-light-surface dark:bg-dark-surface-rail text-light-on-surface dark:text-dark-on-surface shadow-2xs font-semibold'
                    : 'text-light-on-surface-secondary dark:text-dark-on-surface-secondary hover:text-light-on-surface dark:hover:text-dark-on-surface'
                }`}
                title="Linear List view"
              >
                <List className="w-3.5 h-3.5" />
                List
              </button>
            </div>

            <div className="h-4 w-px bg-light-border dark:bg-dark-border" />

            <div className="flex items-center gap-1.5">
              {canManageProject && (
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-1.5 rounded text-light-muted-ink dark:text-dark-muted-ink hover:text-light-on-surface dark:hover:text-dark-on-surface hover:bg-light-surface-rail dark:hover:bg-dark-surface transition-colors"
                  title="Project settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
              {canEdit && (
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white bg-light-primary dark:bg-dark-primary hover:bg-accent transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Issue
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Task Search & Filter Bar */}
        <TaskFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          creatorFilter={creatorFilter}
          onCreatorChange={setCreatorFilter}
          totalTasks={tasks.length}
          filteredTasksCount={filteredTasks.length}
          onReset={handleResetFilters}
        />

        {/* Board View vs List View */}
        {viewMode === 'list' ? (
          <TaskListView tasks={filteredTasks} isFiltered={isFiltered} />
        ) : (
          <div className="flex-1 overflow-x-hidden overflow-y-hidden p-5">
            {/* 3 Unified Responsive Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full">
              {STAGES.map((stage) => {
                const stageTasks = filteredTasks.filter((t) =>
                  stage.statuses.includes(t.status)
                );
                const isDragOver = dragOverStageId === stage.id && canEdit;

                return (
                  <div
                    key={stage.id}
                    onDragOver={(e) => {
                      if (!canEdit) return;
                      e.preventDefault();
                      setDragOverStageId(stage.id);
                    }}
                    onDragLeave={() => {
                      if (!canEdit) return;
                      setDragOverStageId(null);
                    }}
                    onDrop={() => handleDrop(stage)}
                    className={`flex flex-col rounded-lg bg-light-surface-rail dark:bg-dark-surface-rail border transition-all duration-120 overflow-hidden ${
                      isDragOver
                        ? 'border-accent bg-blue-50/20 dark:bg-blue-950/20 shadow-md'
                        : 'border-light-border dark:border-dark-border'
                    }`}
                  >
                    {/* Stage Header */}
                    <div className="px-4 py-3 border-b border-light-border dark:border-dark-border flex items-center justify-between shrink-0 bg-light-surface dark:bg-dark-surface">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${stage.dotClass}`} />
                        <h2 className="text-xs font-semibold text-light-on-surface dark:text-dark-on-surface">
                          {stage.title}
                        </h2>
                        <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-light-surface-rail dark:bg-dark-surface-rail text-light-on-surface-secondary dark:text-dark-on-surface-secondary font-medium">
                          {stageTasks.length}
                        </span>
                      </div>

                      {canEdit && (
                        <button
                          onClick={() => setIsTaskModalOpen(true)}
                          className="p-1 rounded text-light-muted-ink dark:text-dark-muted-ink hover:text-light-on-surface dark:hover:text-dark-on-surface hover:bg-light-surface-rail dark:hover:bg-dark-surface-rail transition-colors"
                          title={`Add task in ${stage.title}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Stage Cards Container: Vertical Scroll Only */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                      {stageTasks.length === 0 ? (
                        <div className="h-28 border border-dashed border-light-border dark:border-dark-border rounded-md flex items-center justify-center text-center p-3">
                          <p className="text-[11px] text-light-muted-ink dark:text-dark-muted-ink">
                            {isDragOver ? stage.dropLabel : 'No tasks in this stage'}
                          </p>
                        </div>
                      ) : (
                        stageTasks.map((task) => {
                          const isDragging = draggedTaskId === task.id;

                          return (
                            <div
                              key={task.id}
                              draggable={canEdit}
                              onDragStart={() => {
                                if (canEdit) setDraggedTaskId(task.id);
                              }}
                              onDragEnd={() => {
                                setDraggedTaskId(null);
                                setDragOverStageId(null);
                              }}
                              onClick={() => setSelectedTask(task)}
                              className={`p-3 rounded bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-accent dark:hover:border-accent transition-all duration-120 ${
                                canEdit ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                              } select-none group shadow-2xs hover:shadow-xs ${
                                isDragging ? 'opacity-40 scale-95 border-accent' : ''
                              }`}
                            >
                              {/* Card Header: Task Key & Status Dropdown */}
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="font-mono text-[11px] font-semibold text-light-on-surface-secondary dark:text-dark-on-surface-secondary group-hover:text-accent transition-colors">
                                  {task.key}
                                </span>

                                <StatusDropdown
                                  currentStatus={task.status}
                                  onStatusChange={(status) => updateTaskStatus(task.id, status)}
                                  size="sm"
                                  disabled={!canEdit}
                                />
                              </div>

                              {/* Task Title */}
                              <h3 className="text-xs font-semibold text-light-on-surface dark:text-dark-on-surface leading-snug line-clamp-2 mb-1">
                                {task.title}
                              </h3>

                              {/* Task Description snippet */}
                              {task.description && (
                                <p className="text-[11px] text-light-muted-ink dark:text-dark-muted-ink line-clamp-2 leading-relaxed mb-2.5">
                                  {task.description}
                                </p>
                              )}

                              {/* Card Footer: Priority Badge & Assignee / Due date */}
                              <div className="flex items-center justify-between pt-2 border-t border-light-border-subtle dark:border-dark-border-subtle text-[11px]">
                                <span
                                  className={`capitalize px-1.5 py-0.2 rounded font-medium text-[10px] ${
                                    task.priority === 'urgent'
                                      ? 'text-red-700 bg-red-50 dark:bg-red-950/50 dark:text-red-300'
                                      : task.priority === 'high'
                                      ? 'text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300'
                                      : task.priority === 'medium'
                                      ? 'text-blue-700 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-300'
                                      : 'text-slate-600 bg-slate-100 dark:bg-dark-surface-rail dark:text-slate-400'
                                  }`}
                                >
                                  {task.priority}
                                </span>

                                <div className="flex items-center gap-2 text-light-on-surface-secondary dark:text-dark-on-surface-secondary">
                                  {task.assigneeId ? (
                                    <span
                                      className="w-5 h-5 rounded-full bg-light-primary dark:bg-dark-primary text-white text-[10px] font-semibold flex items-center justify-center shrink-0"
                                      title={`Assigned to ${task.assigneeId.name}`}
                                    >
                                      {task.assigneeId.name.charAt(0).toUpperCase()}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-light-muted-ink dark:text-dark-muted-ink">
                                      Unassigned
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals & Slide-Over Drawer */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
      <ProjectSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
      <TaskDrawer />
    </>
  );
}
