'use client';

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { WorkspaceRole } from '@/types/models';
import {
  X,
  Users,
  UserPlus,
  Trash2,
  Loader2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Ban
} from 'lucide-react';

interface ManageMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageMembersModal({ isOpen, onClose }: ManageMembersModalProps) {
  const { user } = useAuth();
  const {
    currentWorkspace,
    members,
    invitations,
    isLoadingMembers,
    isLoadingInvitations,
    inviteMember,
    updateMemberRole,
    removeMember,
    cancelInvitation
  } = useWorkspace();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<WorkspaceRole>('member');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [operatingMemberId, setOperatingMemberId] = useState<string | null>(null);
  const [cancelingInviteId, setCancelingInviteId] = useState<string | null>(null);

  if (!isOpen || !currentWorkspace) return null;

  const canManage = currentWorkspace.role === 'owner' || currentWorkspace.role === 'admin';

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsInviting(true);
    setInviteError(null);
    setInviteSuccess(null);
    try {
      const res = await inviteMember(email.trim().toLowerCase(), role);
      if (res?.status === 'pending' || res?.message?.includes('invitation')) {
        setInviteSuccess(`Invitation created and sent to ${email.trim().toLowerCase()}`);
      } else {
        setInviteSuccess(`Successfully added ${email.trim().toLowerCase()} to the workspace`);
      }
      setEmail('');
      setRole('member');
      setTimeout(() => setInviteSuccess(null), 4000);
    } catch (err: any) {
      setInviteError(err.message || 'Failed to invite user to workspace');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (membershipId: string, newRole: WorkspaceRole) => {
    setOperatingMemberId(membershipId);
    setActionError(null);
    try {
      await updateMemberRole(membershipId, newRole);
    } catch (err: any) {
      setActionError(err.message || 'Failed to update member role');
    } finally {
      setOperatingMemberId(null);
    }
  };

  const handleRemove = async (membershipId: string, memberName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from this workspace?`)) {
      return;
    }

    setOperatingMemberId(membershipId);
    setActionError(null);
    try {
      await removeMember(membershipId);
    } catch (err: any) {
      setActionError(err.message || 'Failed to remove member');
    } finally {
      setOperatingMemberId(null);
    }
  };

  const handleCancelInvite = async (invitationId: string, inviteEmail: string) => {
    if (!window.confirm(`Revoke invitation for ${inviteEmail}?`)) {
      return;
    }

    setCancelingInviteId(invitationId);
    setActionError(null);
    try {
      await cancelInvitation(invitationId);
    } catch (err: any) {
      setActionError(err.message || 'Failed to revoke invitation');
    } finally {
      setCancelingInviteId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in-50 duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-lg shadow-xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-dark-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Workspace Members
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-surface-rail text-slate-600 dark:text-slate-400 font-medium">
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Invite Section (For Owner / Admin) */}
          {canManage && (
            <div className="p-4 bg-slate-50 dark:bg-dark-surface-rail border border-slate-200 dark:border-dark-border rounded-lg">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Invite new teammate
              </h3>

              {inviteSuccess && (
                <div className="mb-3 p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span>{inviteSuccess}</span>
                </div>
              )}

              {inviteError && (
                <div className="mb-3 p-2.5 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{inviteError}</span>
                </div>
              )}

              <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-xs bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as WorkspaceRole)}
                  className="text-xs bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded px-3 py-2 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 capitalize"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>

                <button
                  type="submit"
                  disabled={isInviting || !email.trim()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0 shadow-xs"
                >
                  {isInviting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  Invite
                </button>
              </form>
            </div>
          )}

          {actionError && (
            <div className="p-2.5 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Pending Invitations Section (Owner / Admin) */}
          {canManage && invitations.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Pending Invitations ({invitations.length})
                </span>
                {isLoadingInvitations && <Loader2 className="w-3 h-3 animate-spin text-blue-600" />}
              </div>

              <div className="divide-y divide-slate-100 dark:divide-dark-border border border-slate-200 dark:border-dark-border rounded-lg overflow-hidden">
                {invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-dark-surface-rail/50 hover:bg-slate-100/50 dark:hover:bg-dark-surface-rail transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                        {inv.email}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Invited {new Date(inv.createdAt).toLocaleDateString()}
                        {inv.invitedBy ? ` by ${inv.invitedBy.name}` : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        {inv.role}
                      </span>
                      <button
                        onClick={() => handleCancelInvite(inv.id, inv.email)}
                        disabled={cancelingInviteId === inv.id}
                        className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 transition-colors"
                        title="Revoke invitation"
                      >
                        {cancelingInviteId === inv.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Ban className="w-3 h-3" />
                        )}
                        Revoke
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members List */}
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Team Roster
            </div>

            {isLoadingMembers ? (
              <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                Loading members...
              </div>
            ) : members.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No members found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-dark-border border border-slate-200 dark:border-dark-border rounded-lg overflow-hidden">
                {members.map((member) => {
                  const isOwner = member.role === 'owner';
                  const isCurrentUser = member.user.id === user?.id;
                  const isOperating = operatingMemberId === member.membershipId;

                  // Permission checks for role editing:
                  // 1. Owner cannot be changed or removed.
                  // 2. Only owners can edit admins; admins can edit members/viewers.
                  // 3. User cannot remove themselves via this modal.
                  const canEditThisMember =
                    !isOwner &&
                    !isCurrentUser &&
                    (currentWorkspace.role === 'owner' ||
                      (currentWorkspace.role === 'admin' && member.role !== 'admin'));

                  return (
                    <div
                      key={member.membershipId}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-dark-surface-rail transition-colors"
                    >
                      {/* Member Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 flex items-center justify-center font-semibold text-xs shrink-0">
                          {member.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
                            <span className="truncate">{member.user.name}</span>
                            {isCurrentUser && (
                              <span className="text-[10px] text-slate-400 font-normal">(you)</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {member.user.email}
                          </div>
                        </div>
                      </div>

                      {/* Role & Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isOwner ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            <ShieldCheck className="w-3 h-3" />
                            Owner
                          </span>
                        ) : canEditThisMember ? (
                          <select
                            value={member.role}
                            disabled={isOperating}
                            onChange={(e) =>
                              handleRoleChange(member.membershipId, e.target.value as WorkspaceRole)
                            }
                            className="text-[11px] bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded px-2 py-1 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 capitalize cursor-pointer disabled:opacity-50"
                          >
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                            <option value="viewer">Viewer</option>
                          </select>
                        ) : (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-surface text-slate-600 dark:text-slate-400 capitalize">
                            {member.role}
                          </span>
                        )}

                        {canEditThisMember && (
                          <button
                            onClick={() => handleRemove(member.membershipId, member.user.name)}
                            disabled={isOperating}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="Remove member"
                          >
                            {isOperating ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-dark-surface-rail flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-surface-rail transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
