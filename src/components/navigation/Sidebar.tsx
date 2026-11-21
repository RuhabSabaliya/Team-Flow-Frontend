'use client';

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';
import { FolderKanban, Plus, Hash } from 'lucide-react';

export function Sidebar() {
  const { currentWorkspace, projects, currentProject, selectProject } = useWorkspace();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  return (
    <>
            <aside
              className="w-56 flex flex-col shrink-0 h-[calc(100vh-3.5rem)]"
              style={{
                background: 'var(--nav-bg)',
                borderRight: '1px solid var(--nav-border)',
              }}
            >
              {/* Workspace label */}
              <div
                className="px-4 pt-4 pb-3"
                style={{ borderBottom: '1px solid var(--nav-border)' }}
              >
                <div
                  className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--nav-text)' }}
                >
                  Workspace
                </div>
                  <div
                    className="text-sm font-semibold truncate"
                    style={{ color: 'var(--nav-text-active)' }}
                  >
                    {currentWorkspace?.name}
                  </div>
                    <div
                      className="text-xs font-mono mt-0.5 truncate"
                      style={{ color: 'var(--nav-text)' }}
                    >
                      /{currentWorkspace?.slug}
                    </div>
                  </div>

                        {/* Projects list */}
                        <div className="flex-1 overflow-y-auto py-3 px-2">
                          <div className="flex items-center justify-between px-2 mb-1.5">
                            <span
                              className="text-[10px] font-semibold uppercase tracking-widest"
                              style={{ color: 'var(--nav-text)' }}
                            >
                              Projects
                            </span>
                            <button
                              onClick={() => setIsProjectModalOpen(true)}
                              className="p-1 rounded transition-colors"
                              style={{ color: 'var(--nav-text)' }}
                              title="New project"
                              onMouseEnter={e => (e.currentTarget.style.color = 'var(--nav-text-active)')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'var(--nav-text)')}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-0.5">
                            {projects.length === 0 ? (
                                <div className="px-2 py-6 text-center">
                                  <p
                                    className="text-xs mb-2"
                                    style={{ color: 'var(--nav-text)' }}
                                  >
                                    No projects yet
                                  </p>
                                  <button
                                    onClick={() => setIsProjectModalOpen(true)}
                                    className="text-xs font-medium inline-flex items-center gap-1"
                                    style={{ color: 'var(--accent-text)' }}
                                  >
                                    <Plus className="w-3 h-3" />
                                    Add project
                                  </button>
                                </div>
                                ) : (
              projects.map((proj) => {
                const isActive = proj.id === currentProject?.id;
                                return (
                                <button
                                  key={proj.id}
                                  onClick={() => selectProject(proj)}
                                  className="w-full text-left px-2.5 py-2 rounded-md text-xs flex items-center justify-between transition-colors group"
                                  style={{
                                    background: isActive ? 'var(--nav-item-active)' : 'transparent',
                                    color: isActive ? 'var(--nav-text-active)' : 'var(--nav-text)',
                                  }}
                                  onMouseEnter={e => {
                                    if (!isActive) {
                                      e.currentTarget.style.background = 'var(--nav-item-hover)';
                                      e.currentTarget.style.color = 'var(--nav-text-active)';
                                    }
                                  }}
                                  onMouseLeave={e => {
                                    if (!isActive) {
                                      e.currentTarget.style.background = 'transparent';
                                      e.currentTarget.style.color = 'var(--nav-text)';
                                    }
                                  }}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <FolderKanban className="w-3.5 h-3.5 shrink-0 opacity-60" />
                                    <span className="truncate font-medium">{proj.name}</span>
                                  </div>
                                  <span
                                    className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold shrink-0"
                                    style={{
                                      background: isActive ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                                      color: isActive ? 'var(--nav-text-active)' : 'var(--nav-text)',
                                    }}
                                  >
                                    {proj.key}
                                  </span>
                                </button>
                                );
              })
            )}
                              </div>
        </div>

                            {/* Footer */}
                            <div
                              className="px-4 py-3 text-xs"
                              style={{
                                borderTop: '1px solid var(--nav-border)',
                                color: 'var(--nav-text)',
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span>Role</span>
                                <span
                                  className="font-semibold capitalize"
                                  style={{ color: 'var(--nav-text-active)' }}
                                >
                                  {currentWorkspace?.role}
                                </span>
                              </div>
                            </div>
                          </aside>

                          <CreateProjectModal
                            isOpen={isProjectModalOpen}
                            onClose={() => setIsProjectModalOpen(false)}
                          />
                        </>
                        );
}
