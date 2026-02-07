'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { milestoneAPI } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Target, Plus, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetDate: string;
  status: string;
  createdAt: string;
}

export function MilestoneTimeline({ workspaceId }: { workspaceId: string }) {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    targetDate: '',
  });

  const { data: milestones, isLoading } = useQuery({
    queryKey: ['milestones', workspaceId],
    queryFn: async () => {
      const response = await milestoneAPI.getByWorkspace(workspaceId);
      return response.data;
    },
  });

  const createMilestoneMutation = useMutation({
    mutationFn: async (data: any) => {
      return await milestoneAPI.create({ ...data, workspaceId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', workspaceId] });
      setIsCreateModalOpen(false);
      setNewMilestone({ title: '', description: '', targetDate: '' });
    },
  });

  const updateMilestoneMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await milestoneAPI.update(id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', workspaceId] });
    },
  });

  const handleCreateMilestone = () => {
    if (newMilestone.title.trim() && newMilestone.targetDate) {
      createMilestoneMutation.mutate(newMilestone);
    }
  };

  const handleStatusToggle = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    updateMilestoneMutation.mutate({ id, status: newStatus });
  };

  const getMilestoneStatus = (milestone: Milestone) => {
    if (milestone.status === 'completed') {
      return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' };
    }
    const targetDate = new Date(milestone.targetDate);
    const now = new Date();
    if (targetDate < now) {
      return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Overdue' };
    }
    return { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', label: 'In Progress' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading milestones...</div>
      </div>
    );
  }

  const sortedMilestones = [...(milestones || [])].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            {milestones?.length || 0} total milestones
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Milestone
        </Button>
      </div>

      <div className="space-y-4">
        {sortedMilestones.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No milestones yet</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create Your First Milestone
              </Button>
            </div>
          </Card>
        ) : (
          sortedMilestones.map((milestone) => {
            const status = getMilestoneStatus(milestone);
            const StatusIcon = status.icon;
            
            return (
              <Card key={milestone.id} className="hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className={`p-2 ${status.bg} rounded-lg`}>
                    <StatusIcon className={`w-6 h-6 ${status.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{milestone.title}</h3>
                        {milestone.description && (
                          <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${status.bg} ${status.color} font-medium`}>
                        {status.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Target: {format(new Date(milestone.targetDate), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant={milestone.status === 'completed' ? 'outline' : 'primary'}
                        onClick={() => handleStatusToggle(milestone.id, milestone.status)}
                      >
                        {milestone.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Milestone"
      >
        <div className="space-y-4">
          <Input
            label="Milestone Title"
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
            placeholder="e.g., Launch MVP, Reach 1000 users"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newMilestone.description}
              onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
              placeholder="Describe what this milestone represents"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            />
          </div>

          <Input
            label="Target Date"
            type="date"
            value={newMilestone.targetDate}
            onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCreateMilestone}
              loading={createMilestoneMutation.isPending}
              fullWidth
            >
              Create Milestone
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
