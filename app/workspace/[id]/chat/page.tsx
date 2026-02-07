'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { WorkspaceChat } from '@/components/chat/WorkspaceChat';
import { ChannelSidebar } from '@/components/chat/ChannelSidebar';
import { CreateChannelModal } from '@/components/chat/CreateChannelModal';
import { channelsAPI, workspaceMembersAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';

export default function ChatPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const { user } = useAuthStore();
  const [activeChannelId, setActiveChannelId] = useState<string | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch channels
  const { data: channels = [] } = useQuery({
    queryKey: ['channels', workspaceId],
    queryFn: async () => {
      const response = await channelsAPI.getByWorkspace(workspaceId);
      return response.data;
    },
  });

  // Fetch workspace members to check role
  const { data: members = [] } = useQuery({
    queryKey: ['workspace-members', workspaceId],
    queryFn: async () => {
      const response = await workspaceMembersAPI.getMembers(workspaceId);
      return response.data;
    },
  });

  // Auto-select first channel
  useEffect(() => {
    if (channels.length > 0 && !activeChannelId) {
      setActiveChannelId(channels[0].id);
    }
  }, [channels, activeChannelId]);

  const currentMember = members.find((m: any) => m.userId === user?.id);
  const canCreateChannel = currentMember?.role === 'owner' || currentMember?.role === 'admin';

  const activeChannel = channels.find((c: any) => c.id === activeChannelId);

  // Get display name for DM channels
  const getChannelDisplayName = () => {
    if (!activeChannel) return '';
    
    if (activeChannel.type === 'dm') {
      // Find the other user in the DM
      const otherUserId = activeChannel.members?.find((m: any) => m.userId !== user?.id)?.userId;
      if (otherUserId) {
        const otherMember = members.find((m: any) => m.userId === otherUserId);
        if (otherMember) {
          return otherMember.user.name;
        }
      }
    }
    
    return activeChannel.name;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Team Chat</h2>
        <p className="text-gray-600 mt-1">Real-time communication with your team</p>
      </div>

      <div className="flex h-[600px] border border-gray-200 rounded-lg overflow-hidden">
        <ChannelSidebar
          workspaceId={workspaceId}
          activeChannelId={activeChannelId}
          onChannelSelect={setActiveChannelId}
          onCreateChannel={() => setIsCreateModalOpen(true)}
          canCreateChannel={canCreateChannel}
        />
        <div className="flex-1">
          <WorkspaceChat
            workspaceId={workspaceId}
            channelId={activeChannelId}
            channelName={getChannelDisplayName()}
            channelType={activeChannel?.type}
            channelMembers={activeChannel?.members}
          />
        </div>
      </div>

      <CreateChannelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        workspaceId={workspaceId}
      />
    </div>
  );
}
