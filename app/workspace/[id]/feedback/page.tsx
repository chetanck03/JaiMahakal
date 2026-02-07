import { FeedbackDashboard } from '@/components/feedback/FeedbackDashboard';

export default function FeedbackPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Feedback</h2>
        <p className="text-gray-600 mt-1">Collect and analyze feedback</p>
      </div>
      <FeedbackDashboard workspaceId={params.id} />
    </div>
  );
}
