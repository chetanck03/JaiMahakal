'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceAPI } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Briefcase, Users, CheckCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function WorkspaceList() {
  const queryClient = useQueryClient();
  const [editingWorkspace, setEditingWorkspace] = useState<any>(null);
  const [deletingWorkspace, setDeletingWorkspace] = useState<any>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', industry: '' });

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await workspaceAPI.getAll();
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => workspaceAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setEditingWorkspace(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => workspaceAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setDeletingWorkspace(null);
    },
  });

  const handleEdit = (workspace: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData({
      name: workspace.name,
      description: workspace.description || '',
      industry: workspace.industry || '',
    });
    setEditingWorkspace(workspace);
    setOpenMenuId(null);
  };

  const handleDelete = (workspace: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingWorkspace(workspace);
    setOpenMenuId(null);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWorkspace) {
      updateMutation.mutate({ id: editingWorkspace.id, data: formData });
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingWorkspace) {
      deleteMutation.mutate(deletingWorkspace.id);
    }
  };

  const toggleMenu = (workspaceId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(openMenuId === workspaceId ? null : workspaceId);
  };

  if (isLoading) {
    return <div className="text-gray-600">Loading workspaces...</div>;
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workspaces yet</h3>
          <p className="text-gray-600">Create your first workspace to get started</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace: any) => (
          <div key={workspace.id} className="relative">
            <Link href={`/workspace/${workspace.id}`}>
              <Card className="hover:shadow-md transition cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{workspace.name}</h3>
                    {workspace.industry && (
                      <p className="text-sm text-gray-600 mt-1">{workspace.industry}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <button
                      onClick={(e) => toggleMenu(workspace.id, e)}
                      className="p-1 hover:bg-gray-100 rounded-md transition"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {workspace.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{workspace.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{workspace.members?.length || 0} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{workspace._count?.tasks || 0} tasks</span>
                  </div>
                </div>
              </Card>
            </Link>

            {openMenuId === workspace.id && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenMenuId(null)}
                />
                <div className="absolute right-2 top-12 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]">
                  <button
                    onClick={(e) => handleEdit(workspace, e)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Workspace
                  </button>
                  <button
                    onClick={(e) => handleDelete(workspace, e)}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Workspace
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingWorkspace && (
        <Modal
          isOpen={!!editingWorkspace}
          onClose={() => setEditingWorkspace(null)}
          title="Edit Workspace"
        >
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workspace Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter workspace name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <Input
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., Technology, Healthcare"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your workspace"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                onClick={() => setEditingWorkspace(null)}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingWorkspace && (
        <Modal
          isOpen={!!deletingWorkspace}
          onClose={() => setDeletingWorkspace(null)}
          title="Delete Workspace"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete <strong>{deletingWorkspace.name}</strong>? This action cannot be undone and will delete all associated data.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setDeletingWorkspace(null)}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Workspace'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
