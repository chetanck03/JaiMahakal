'use client';

import { Card } from '@/components/ui/Card';
import { MessageSquare } from 'lucide-react';

export function FeedbackDashboard({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Recent Feedback</h3>
        </div>
        <p className="text-gray-600">No feedback yet. Create a feedback request to get started.</p>
      </Card>
    </div>
  );
}
