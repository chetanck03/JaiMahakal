'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackAPI } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { MessageSquare, Plus, Link as LinkIcon, Star, CheckCircle2, Copy } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

interface FeedbackRequest {
  id: string;
  title: string;
  description?: string;
  shareableLink: string;
  createdAt: string;
  feedbacks: Feedback[];
}

interface Feedback {
  id: string;
  content: string;
  rating?: number;
  isAddressed: boolean;
  createdAt: string;
  user?: {
    name: string;
  };
}

export function FeedbackDashboard({ workspaceId }: { workspaceId: string }) {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
  });

  const { data: feedbackRequests, isLoading } = useQuery({
    queryKey: ['feedback', workspaceId],
    queryFn: async () => {
      const response = await feedbackAPI.getByWorkspace(workspaceId);
      return response.data;
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      return await feedbackAPI.createRequest({ ...data, workspaceId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback', workspaceId] });
      setIsCreateModalOpen(false);
      setNewRequest({ title: '', description: '' });
    },
  });

  const markAddressedMutation = useMutation({
    mutationFn: async (feedbackId: string) => {
      return await feedbackAPI.markAddressed(feedbackId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback', workspaceId] });
    },
  });

  const handleCreateRequest = () => {
    if (newRequest.title.trim()) {
      createRequestMutation.mutate(newRequest);
    }
  };

  const handleCopyLink = (link: string) => {
    const fullLink = `${window.location.origin}/feedback/${link}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading feedback...</div>
      </div>
    );
  }

  const totalFeedback = feedbackRequests?.reduce(
    (sum: number, req: FeedbackRequest) => sum + req.feedbacks.length,
    0
  ) || 0;

  const addressedFeedback = feedbackRequests?.reduce(
    (sum: number, req: FeedbackRequest) =>
      sum + req.feedbacks.filter((f: Feedback) => f.isAddressed).length,
    0
  ) || 0;

  const avgRating = feedbackRequests?.reduce((sum: number, req: FeedbackRequest) => {
    const ratings = req.feedbacks.filter((f: Feedback) => f.rating).map((f: Feedback) => f.rating!);
    return sum + (ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0);
  }, 0) / (feedbackRequests?.length || 1);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <h4 className="text-sm text-gray-600 mb-1">Total Feedback</h4>
          <p className="text-3xl font-bold text-gray-900">{totalFeedback}</p>
        </Card>
        <Card>
          <h4 className="text-sm text-gray-600 mb-1">Addressed</h4>
          <p className="text-3xl font-bold text-gray-900">{addressedFeedback}</p>
        </Card>
        <Card>
          <h4 className="text-sm text-gray-600 mb-1">Avg Rating</h4>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
            {renderStars(Math.round(avgRating))}
          </div>
        </Card>
      </div>

      {/* Create Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Feedback Requests</h3>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Feedback Requests */}
      <div className="space-y-6">
        {!feedbackRequests || feedbackRequests.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No feedback requests yet</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create Your First Request
              </Button>
            </div>
          </Card>
        ) : (
          feedbackRequests.map((request: FeedbackRequest) => (
            <Card key={request.id}>
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{request.title}</h4>
                    {request.description && (
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700 font-mono">
                    {window.location.origin}/feedback/{request.shareableLink}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyLink(request.shareableLink)}
                  >
                    {copiedLink === request.shareableLink ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Feedback List */}
              <div className="border-t border-gray-200 pt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">
                  Feedback ({request.feedbacks.length})
                </h5>
                {request.feedbacks.length === 0 ? (
                  <p className="text-sm text-gray-500">No feedback received yet</p>
                ) : (
                  <div className="space-y-3">
                    {request.feedbacks.map((feedback: Feedback) => (
                      <div
                        key={feedback.id}
                        className={`p-3 rounded-lg ${
                          feedback.isAddressed ? 'bg-green-50' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {feedback.rating && renderStars(feedback.rating)}
                            {feedback.user && (
                              <span className="text-xs text-gray-600">by {feedback.user.name}</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {format(new Date(feedback.createdAt), 'MMM dd')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{feedback.content}</p>
                        {!feedback.isAddressed && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAddressedMutation.mutate(feedback.id)}
                          >
                            Mark as Addressed
                          </Button>
                        )}
                        {feedback.isAddressed && (
                          <div className="flex items-center gap-1 text-xs text-green-700">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Addressed</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Feedback Request"
      >
        <div className="space-y-4">
          <Input
            label="Request Title"
            value={newRequest.title}
            onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
            placeholder="e.g., Product feedback, Feature request"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newRequest.description}
              onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
              placeholder="What kind of feedback are you looking for?"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCreateRequest}
              loading={createRequestMutation.isPending}
              fullWidth
            >
              Create Request
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
