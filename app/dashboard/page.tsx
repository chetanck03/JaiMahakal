import { WorkspaceList } from '@/components/dashboard/WorkspaceList';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { CreateWorkspaceButton } from '@/components/workspace/CreateWorkspaceButton';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your startup workspaces</p>
        </div>
        <CreateWorkspaceButton />
      </div>

      <QuickStats />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Workspaces</h2>
        <WorkspaceList />
      </div>
    </div>
  );
}
