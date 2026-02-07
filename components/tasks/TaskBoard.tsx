'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Calendar, User } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  assignee?: {
    name: string;
  };
}

export function TaskBoard({ workspaceId }: { workspaceId: string }) {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', workspaceId],
    queryFn: async () => {
      const response = await taskAPI.getByWorkspace(workspaceId);
      return response.data;
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: any) => {
      return await taskAPI.create({ ...taskData, workspaceId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] });
      setIsCreateModalOpen(false);
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await taskAPI.update(id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] });
    },
  });

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'done', title: 'Done', color: 'bg-green-100' },
    { id: 'blocked', title: 'Blocked', color: 'bg-red-100' },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks?.filter((task: Task) => task.status === status) || [];
  };

  const handleCreateTask = () => {
    if (newTask.title.trim()) {
      createTaskMutation.mutate(newTask);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateTaskMutation.mutate({ id: taskId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            {tasks?.length || 0} total tasks
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div key={column.id}>
              <div className={`${column.color} rounded-lg p-3 mb-4`}>
                <h3 className="font-semibold text-gray-900 flex items-center justify-between">
                  {column.title}
                  <span className="text-sm font-normal text-gray-600">
                    {columnTasks.length}
                  </span>
                </h3>
              </div>
              
              <div className="space-y-3">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No tasks
                  </div>
                ) : (
                  columnTasks.map((task: Task) => (
                    <Card key={task.id} className="p-4 hover:shadow-md transition cursor-pointer">
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {task.priority && (
                            <span
                              className={`px-2 py-1 rounded-full font-medium ${
                                task.priority === 'high'
                                  ? 'bg-red-100 text-red-700'
                                  : task.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {task.priority}
                            </span>
                          )}
                        </div>

                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(task.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {task.assignee && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                          <User className="w-3 h-3" />
                          <span>{task.assignee.name}</span>
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-gray-200 rounded bg-white text-gray-700"
                        >
                          {columns.map((col) => (
                            <option key={col.id} value={col.id}>
                              {col.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <div className="space-y-4">
          <Input
            label="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Enter task title"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Enter task description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <Input
              label="Due Date"
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCreateTask}
              loading={createTaskMutation.isPending}
              fullWidth
            >
              Create Task
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
