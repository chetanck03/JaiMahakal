'use client';

import { Card } from '@/components/ui/Card';
import { Target } from 'lucide-react';

export function MilestoneTimeline({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start gap-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Launch MVP</h3>
            <p className="text-sm text-gray-600 mb-2">Target: March 2026</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
