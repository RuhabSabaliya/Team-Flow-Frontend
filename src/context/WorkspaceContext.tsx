'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '@/lib/api';
import {
  Workspace,
  WorkspaceMemberItem,
  WorkspaceInvitation,
  Project,
  Task,
  TaskStatus,
  TaskPriority,
  WorkspaceRole
} from '@/types/models';

export interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  projects: Project[];
  currentProject: Project | null;
  tasks: Task[];
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  members: WorkspaceMemberItem[];
  invitations: WorkspaceInvitation[];
  isLoadingWorkspaces: boolean;
  isLoadingProjects: boolean;
  isLoadingTasks: boolean;
  isLoadingMembers: boolean;
  isLoadingInvitations: boolean;
  error: string | null;
  createWorkspace: (name: string, slug?: string, key?: string) => Promise<Workspace>;
  selectWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (data: { name?: string; slug?: string }) => Promise<Workspace>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
  createProject: (name: string, key?: string, description?: string) => Promise<Project>;
  selectProject: (project: Project) => void;
  updateProject: (
    projectId: string,
    data: { name?: string; description?: string }
  ) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
  createTask: (data: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    assigneeId?: string;
    dueDate?: string;
  }) => Promise<Task>;
  updateTask: (taskId: string, data: Partial<Task>) => Promise<Task>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  inviteMember: (email: string, role?: WorkspaceRole) => Promise<any>;
  updateMemberRole: (membershipId: string, role: WorkspaceRole) => Promise<void>;
  removeMember: (membershipId: string) => Promise<void>;
  cancelInvitation: (invitationId: string) => Promise<void>;
  refreshWorkspaces: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  refreshMembers: () => Promise<void>;
  refreshInvitations: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [members, setMembers] = useState<WorkspaceMemberItem[]>([]);
  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);

  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user's workspaces
   */
  const refreshWorkspaces = useCallback(async () => {
    if (!user) {
      setWorkspaces([]);
      setCurrentWorkspace(null);
      return;
    }
    setIsLoadingWorkspaces(true);
    try {
      const data = await apiClient<Workspace[]>('/workspaces');
      setWorkspaces(data);
      if (data.length > 0) {
        setCurrentWorkspace((prev) => {
          if (prev && data.some((w) => w.id === prev.id)) return prev;
          return data[0];
        });
      } else {
        setCurrentWorkspace(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch workspaces');
    } finally {
      setIsLoadingWorkspaces(false);
    }
  }, [user]);

  useEffect(() => {
    refreshWorkspaces();
  }, [refreshWorkspaces]);

  /**
   * Fetch projects when currentWorkspace changes
   */
  const refreshProjects = useCallback(async () => {
    if (!currentWorkspace) {
      setProjects([]);
      setCurrentProject(null);
      return;
    }
    setIsLoadingProjects(true);
    try {
      const data = await apiClient<Project[]>(`/workspaces/${currentWorkspace.id}/projects`);
      setProjects(data);
      if (data.length > 0) {
        setCurrentProject((prev) => {
          if (prev && data.some((p) => p.id === prev.id)) return prev;
          return data[0];
        });
      } else {
        setCurrentProject(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setIsLoadingProjects(false);
    }
  }, [currentWorkspace]);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  /**
   * Fetch members when currentWorkspace changes
   */
  const refreshMembers = useCallback(async () => {
    if (!currentWorkspace) {
      setMembers([]);
      return;
    }
    setIsLoadingMembers(true);
    try {
      const data = await apiClient<WorkspaceMemberItem[]>(`/workspaces/${currentWorkspace.id}/members`);
      setMembers(data);
    } catch (err: any) {
      console.error('Failed to fetch workspace members:', err);
    } finally {
      setIsLoadingMembers(false);
    }
  }, [currentWorkspace]);

  useEffect(() => {
    refreshMembers();
  }, [refreshMembers]);

  /**
   * Fetch pending invitations (for owner or admin)
   */
  const refreshInvitations = useCallback(async () => {
    if (!currentWorkspace || (currentWorkspace.role !== 'owner' && currentWorkspace.role !== 'admin')) {
      setInvitations([]);
      return;
    }
    setIsLoadingInvitations(true);
    try {
      const data = await apiClient<WorkspaceInvitation[]>(`/workspaces/${currentWorkspace.id}/invitations`);
      setInvitations(data);
    } catch (err: any) {
      console.error('Failed to fetch workspace invitations:', err);
    } finally {
      setIsLoadingInvitations(false);
    }
  }, [currentWorkspace]);

  useEffect(() => {
    refreshInvitations();
  }, [refreshInvitations]);

  /**
   * Fetch tasks when currentProject changes
   */
  const refreshTasks = useCallback(async () => {
    if (!currentWorkspace || !currentProject) {
      setTasks([]);
      return;
    }
    setIsLoadingTasks(true);
    try {
      const data = await apiClient<Task[]>(
        `/workspaces/${currentWorkspace.id}/projects/${currentProject.id}/tasks`
      );
      setTasks(data);
      // Keep selectedTask synchronized
      setSelectedTask((prev) => {
        if (!prev) return null;
        return data.find((t) => t.id === prev.id) || null;
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setIsLoadingTasks(false);
    }
  }, [currentWorkspace, currentProject]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  /**
   * Create a new workspace
   */
  const createWorkspace = async (name: string, slug?: string, key?: string): Promise<Workspace> => {
    const ws = await apiClient<Workspace>('/workspaces', {
      method: 'POST',
      body: JSON.stringify({ name, slug: slug || undefined, key: key || undefined })
    });
    await refreshWorkspaces();
    setCurrentWorkspace(ws);
    return ws;
  };

  /**
   * Update current workspace (name, slug)
   */
  const updateWorkspace = async (data: { name?: string; slug?: string }): Promise<Workspace> => {
    if (!currentWorkspace) throw new Error('No active workspace selected');

    // Optimistic update
    setCurrentWorkspace((prev) => (prev ? { ...prev, ...data } : null));
    setWorkspaces((prev) =>
      prev.map((w) => (w.id === currentWorkspace.id ? { ...w, ...data } : w))
    );

    try {
      const updated = await apiClient<Workspace>(
        `/workspaces/${currentWorkspace.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data)
        }
      );
      await refreshWorkspaces();
      setCurrentWorkspace(updated);
      return updated;
    } catch (err: any) {
      await refreshWorkspaces(); // Rollback on failure
      throw err;
    }
  };

  /**
   * Delete workspace (owner only)
   */
  const deleteWorkspace = async (workspaceId: string): Promise<void> => {
    // Optimistic removal
    setWorkspaces((prev) => {
      const remaining = prev.filter((w) => w.id !== workspaceId);
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(remaining.length > 0 ? remaining[0] : null);
      }
      return remaining;
    });

    try {
      await apiClient(`/workspaces/${workspaceId}`, {
        method: 'DELETE'
      });
      await refreshWorkspaces();
    } catch (err: any) {
      await refreshWorkspaces(); // Rollback on failure
      throw err;
    }
  };

  /**
   * Create a new project
   */
  const createProject = async (
    name: string,
    key?: string,
    description?: string
  ): Promise<Project> => {
    if (!currentWorkspace) throw new Error('No active workspace selected');

    const proj = await apiClient<Project>(`/workspaces/${currentWorkspace.id}/projects`, {
      method: 'POST',
      body: JSON.stringify({ name, key: key || undefined, description })
    });
    await refreshProjects();
    setCurrentProject(proj);
    return proj;
  };

  /**
   * Update project settings (name, description)
   */
  const updateProject = async (
    projectId: string,
    data: { name?: string; description?: string }
  ): Promise<Project> => {
    if (!currentWorkspace) throw new Error('No active workspace selected');

    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, ...data } : p))
    );
    if (currentProject?.id === projectId) {
      setCurrentProject((prev) => (prev ? { ...prev, ...data } : null));
    }

    try {
      const updated = await apiClient<Project>(
        `/workspaces/${currentWorkspace.id}/projects/${projectId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data)
        }
      );
      await refreshProjects();
      return updated;
    } catch (err: any) {
      await refreshProjects();
      throw err;
    }
  };

  /**
   * Delete project (cascading all tasks)
   */
  const deleteProject = async (projectId: string): Promise<void> => {
    if (!currentWorkspace) return;

    // Optimistic removal
    setProjects((prev) => {
      const remaining = prev.filter((p) => p.id !== projectId);
      if (currentProject?.id === projectId) {
        setCurrentProject(remaining.length > 0 ? remaining[0] : null);
      }
      return remaining;
    });

    try {
      await apiClient(
        `/workspaces/${currentWorkspace.id}/projects/${projectId}`,
        {
          method: 'DELETE'
        }
      );
      await refreshProjects();
    } catch (err: any) {
      await refreshProjects();
      throw err;
    }
  };

  /**
   * Create a new task
   */
  const createTask = async (data: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    assigneeId?: string;
    dueDate?: string;
  }): Promise<Task> => {
    if (!currentWorkspace || !currentProject) {
      throw new Error('Workspace and project must be selected');
    }

    const newTask = await apiClient<Task>(
      `/workspaces/${currentWorkspace.id}/projects/${currentProject.id}/tasks`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    );
    await refreshTasks();
    return newTask;
  };

  /**
   * Update full task details (title, description, status, priority, dueDate)
   */
  const updateTask = async (taskId: string, data: Partial<Task>): Promise<Task> => {
    if (!currentWorkspace) throw new Error('No active workspace selected');

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...data } : t))
    );
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, ...data } : null));
    }

    try {
      const updated = await apiClient<Task>(
        `/workspaces/${currentWorkspace.id}/tasks/${taskId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data)
        }
      );
      await refreshTasks();
      return updated;
    } catch (err: any) {
      await refreshTasks(); // Rollback on failure
      throw err;
    }
  };

  /**
   * Transition Task Status quickly
   */
  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    await updateTask(taskId, { status });
  };

  /**
   * Delete a task
   */
  const deleteTask = async (taskId: string) => {
    if (!currentWorkspace) return;

    // Optimistic removal
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }

    try {
      await apiClient(`/workspaces/${currentWorkspace.id}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      await refreshTasks();
    } catch (err: any) {
      await refreshTasks(); // Rollback on failure
      throw err;
    }
  };

  /**
   * Invite member to workspace (creates member or pending invitation)
   */
  const inviteMember = async (
    email: string,
    role: WorkspaceRole = 'member'
  ): Promise<any> => {
    if (!currentWorkspace) throw new Error('No active workspace selected');

    const result = await apiClient<any>(
      `/workspaces/${currentWorkspace.id}/members`,
      {
        method: 'POST',
        body: JSON.stringify({ email, role })
      }
    );
    await refreshMembers();
    await refreshInvitations();
    return result;
  };

  /**
   * Update member role
   */
  const updateMemberRole = async (
    membershipId: string,
    role: WorkspaceRole
  ): Promise<void> => {
    if (!currentWorkspace) return;

    // Optimistic update
    setMembers((prev) =>
      prev.map((m) => (m.membershipId === membershipId ? { ...m, role } : m))
    );

    try {
      await apiClient(
        `/workspaces/${currentWorkspace.id}/members/${membershipId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ role })
        }
      );
      await refreshMembers();
    } catch (err: any) {
      await refreshMembers(); // Rollback on failure
      throw err;
    }
  };

  /**
   * Remove member from workspace
   */
  const removeMember = async (membershipId: string): Promise<void> => {
    if (!currentWorkspace) return;

    // Optimistic removal
    setMembers((prev) => prev.filter((m) => m.membershipId !== membershipId));

    try {
      await apiClient(
        `/workspaces/${currentWorkspace.id}/members/${membershipId}`,
        {
          method: 'DELETE'
        }
      );
      await refreshMembers();
    } catch (err: any) {
      await refreshMembers(); // Rollback on failure
      throw err;
    }
  };

  /**
   * Cancel / Revoke pending invitation
   */
  const cancelInvitation = async (invitationId: string): Promise<void> => {
    if (!currentWorkspace) return;

    // Optimistic removal
    setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));

    try {
      await apiClient(
        `/workspaces/${currentWorkspace.id}/invitations/${invitationId}`,
        {
          method: 'DELETE'
        }
      );
      await refreshInvitations();
    } catch (err: any) {
      await refreshInvitations();
      throw err;
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        projects,
        currentProject,
        tasks,
        selectedTask,
        setSelectedTask,
        members,
        invitations,
        isLoadingWorkspaces,
        isLoadingProjects,
        isLoadingTasks,
        isLoadingMembers,
        isLoadingInvitations,
        error,
        createWorkspace,
        selectWorkspace: setCurrentWorkspace,
        updateWorkspace,
        deleteWorkspace,
        createProject,
        selectProject: setCurrentProject,
        updateProject,
        deleteProject,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        inviteMember,
        updateMemberRole,
        removeMember,
        cancelInvitation,
        refreshWorkspaces,
        refreshProjects,
        refreshTasks,
        refreshMembers,
        refreshInvitations
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
