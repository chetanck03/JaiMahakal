import { MilestoneTimeline } from '@/components/milestones/MilestoneTimeline';

export default function MilestonesPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Milestones</h2>
        <p className="text-gray-600 mt-1">Track your startup milestones</p>
      </div>
      <MilestoneTimeline workspaceId={params.id} />
    </div>
  );
}
