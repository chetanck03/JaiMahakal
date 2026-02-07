'use client';

import { Card } from '@/components/ui/Card';

export function TaskBoard({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {['Not Started', 'In Progress', 'Completed', 'Blocked'].map((status) => (
        <div key={status}>
          <h3 className="font-semibold text-gray-900 mb-4">{status}</h3>
          <div className="space-y-3">
            <Card className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">Sample Task</h4>
              <p className="text-sm text-gray-600">Task description here...</p>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
