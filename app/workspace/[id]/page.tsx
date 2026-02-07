import { WorkspaceOverview } from '@/components/workspace/WorkspaceOverview';

export default function WorkspacePage({ params }: { params: { id: string } }) {
  return <WorkspaceOverview workspaceId={params.id} />;
}
