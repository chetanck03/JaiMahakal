'use client';

import { useQuery } from '@tanstack/react-query';
import { workspaceAPI } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Briefcase, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export function WorkspaceList() {
  const { data: workspaces, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await workspaceAPI.getAll();
      return response.data;
    },
  });

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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((workspace: any) => (
        <Link key={workspace.id} href={`/workspace/${workspace.id}`}>
          <Card className="hover:shadow-md transition cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{workspace.name}</h3>
                {workspace.industry && (
                  <p className="text-sm text-gray-600 mt-1">{workspace.industry}</p>
                )}
              </div>
              <Briefcase className="w-5 h-5 text-blue-600" />
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
      ))}
    </div>
  );
}
