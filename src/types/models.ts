export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'on_hold' | 'done' | 'canceled';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';
export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  key?: string;
  role: WorkspaceRole;
  joinedAt: string;
  createdAt: string;
}

export interface WorkspaceMemberItem {
  membershipId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: WorkspaceRole;
  joinedAt: string;
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: WorkspaceRole;
  invitedBy?: {
    id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'declined' | 'canceled';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string;
  workspaceId: string;
  taskSequence: number;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  workspaceId: string;
  userId: {
    id: string;
    name: string;
    email: string;
  };
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  key: string;
  taskNumber: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  workspaceId: string;
  projectId: string;
  assigneeId?: {
    id: string;
    name: string;
    email: string;
  };
  creatorId: {
    id: string;
    name: string;
    email: string;
  };
  dueDate?: string;
  attachments?: TaskAttachment[];
  createdAt: string;
  updatedAt: string;
}
