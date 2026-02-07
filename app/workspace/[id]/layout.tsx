import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { WorkspaceTabs } from '@/components/workspace/WorkspaceTabs';

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div className="max-w-7xl mx-auto">
      <WorkspaceHeader workspaceId={params.id} />
      <WorkspaceTabs workspaceId={params.id} />
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
