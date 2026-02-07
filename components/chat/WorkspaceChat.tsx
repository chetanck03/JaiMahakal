'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Send, Trash2, Edit2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';
import { io, Socket } from 'socket.io-client';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function WorkspaceChat({ workspaceId }: { workspaceId: string }) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', workspaceId],
    queryFn: async () => {
      const response = await api.get(`/messages/workspace/${workspaceId}`);
      return response.data;
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return await api.post('/messages', { workspaceId, content });
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', workspaceId] });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      return await api.delete(`/messages/${messageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', workspaceId] });
    },
  });

  // Update message mutation
  const updateMessageMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      return await api.put(`/messages/${id}`, { content });
    },
    onSuccess: () => {
      setEditingId(null);
      setEditContent('');
      queryClient.invalidateQueries({ queryKey: ['messages', workspaceId] });
    },
  });

  // Setup WebSocket
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const newSocket = io(socketUrl, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('join-workspace', workspaceId);
    });

    newSocket.on('new-message', (newMessage: Message) => {
      queryClient.setQueryData(['messages', workspaceId], (old: Message[] = []) => {
        return [...old, newMessage];
      });
    });

    newSocket.on('message-deleted', ({ id }: { id: string }) => {
      queryClient.setQueryData(['messages', workspaceId], (old: Message[] = []) => {
        return old.filter((msg) => msg.id !== id);
      });
    });

    newSocket.on('message-updated', (updatedMessage: Message) => {
      queryClient.setQueryData(['messages', workspaceId], (old: Message[] = []) => {
        return old.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg));
      });
    });

    newSocket.on('user-typing', ({ userName }: { userName: string }) => {
      setTypingUsers((prev) => [...new Set([...prev, userName])]);
    });

    newSocket.on('user-stopped-typing', ({ userName }: { userName: string }) => {
      setTypingUsers((prev) => prev.filter((name) => name !== userName));
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('leave-workspace', workspaceId);
      newSocket.disconnect();
    };
  }, [workspaceId, queryClient]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message);
      if (socket) {
        socket.emit('typing-stop', { workspaceId, userName: user?.name });
      }
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);

    if (socket && user) {
      socket.emit('typing-start', { workspaceId, userName: user.name });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing-stop', { workspaceId, userName: user.name });
      }, 1000);
    }
  };

  const handleEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditContent(msg.content);
  };

  const handleUpdate = () => {
    if (editContent.trim() && editingId) {
      updateMessageMutation.mutate({ id: editingId, content: editContent });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Loading chat...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg: Message) => {
            const isOwn = msg.user.id === user?.id;
            const isEditing = editingId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isOwn && (
                    <span className="text-xs text-gray-600 mb-1">{msg.user.name}</span>
                  )}
                  
                  {isEditing ? (
                    <div className="w-full">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        rows={2}
                      />
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={handleUpdate}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null);
                            setEditContent('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.content}</p>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                          {format(new Date(msg.createdAt), 'HH:mm')}
                        </span>
                        {isOwn && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEdit(msg)}
                              className="hover:opacity-70"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteMessageMutation.mutate(msg.id)}
                              className="hover:opacity-70"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-xs text-gray-500 italic">
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          />
          <Button
            onClick={handleSend}
            loading={sendMessageMutation.isPending}
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
