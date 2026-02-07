'use client';

import { Card } from '@/components/ui/Card';
import { BarChart3 } from 'lucide-react';

export function AnalyticsDashboard({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <h4 className="text-sm text-gray-600 mb-1">Task Completion</h4>
          <p className="text-3xl font-bold text-gray-900">68%</p>
        </Card>
        <Card>
          <h4 className="text-sm text-gray-600 mb-1">Avg. Completion Time</h4>
          <p className="text-3xl font-bold text-gray-900">3.2d</p>
        </Card>
        <Card>
          <h4 className="text-sm text-gray-600 mb-1">Team Velocity</h4>
          <p className="text-3xl font-bold text-gray-900">12/wk</p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Progress Over Time</h3>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-600">Chart visualization coming soon...</p>
        </div>
      </Card>
    </div>
  );
}
