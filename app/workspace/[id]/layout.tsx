import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { WorkspaceTabs } from '@/components/workspace/WorkspaceTabs';

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <div className="max-w-7xl mx-auto">
      <WorkspaceHeader workspaceId={id} />
      <WorkspaceTabs workspaceId={id} />
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
