import { WorkspaceChat } from '@/components/chat/WorkspaceChat';

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Team Chat</h2>
        <p className="text-gray-600 mt-1">Real-time communication with your team</p>
      </div>
      <WorkspaceChat workspaceId={id} />
    </div>
  );
}
