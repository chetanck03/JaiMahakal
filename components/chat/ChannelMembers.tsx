'use client';

import { useState } from 'react';
import { Users, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface Member {
  userId: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ChannelMembersProps {
  members: Member[];
  channelName: string;
}

export function ChannelMembers({ members, channelName }: ChannelMembersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
        title="View members"
      >
        <Users className="w-4 h-4" />
        <span className="text-sm font-medium">{members.length}</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Members of ${channelName}`}>
        <div className="space-y-2">
          {members.length === 0 ? (
            <div className="text-center py-8 text-gray-600">No members in this channel</div>
          ) : (
            members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {member.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{member.user.name}</div>
                  <div className="text-sm text-gray-600">{member.user.email}</div>
                </div>
                <div className="text-xs text-gray-500">
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </>
  );
}
