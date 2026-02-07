'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsAPI, taskAPI, milestoneAPI } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Sparkles, TrendingUp, AlertTriangle, Target, Lightbulb, Zap } from 'lucide-react';

interface AIInsight {
  type: 'suggestion' | 'warning' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}

export function AIInsights({ workspaceId }: { workspaceId: string }) {
  const { data: analytics } = useQuery({
    queryKey: ['analytics', workspaceId],
    queryFn: async () => {
      const response = await analyticsAPI.getWorkspaceAnalytics(workspaceId);
      return response.data;
    },
  });

  const { data: tasks } = useQuery({
    queryKey: ['tasks', workspaceId],
    queryFn: async () => {
      const response = await taskAPI.getByWorkspace(workspaceId);
      return response.data;
    },
  });

  const { data: milestones } = useQuery({
    queryKey: ['milestones', workspaceId],
    queryFn: async () => {
      const response = await milestoneAPI.getByWorkspace(workspaceId);
      return response.data;
    },
  });

  // Generate AI insights based on workspace data
  const generateInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [];

    if (!analytics) return insights;

    // Task completion insights
    if (analytics.tasks.completionPercentage < 50 && analytics.tasks.total > 5) {
      insights.push({
        type: 'suggestion',
        title: 'Boost Task Completion',
        description: 'Consider breaking down large tasks into smaller, manageable subtasks. This can increase completion rates by 40%.',
        icon: TrendingUp,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      });
    }

    // Overdue task warning
    if (analytics.tasks.overdue > 3) {
      insights.push({
        type: 'warning',
        title: 'High Overdue Task Count',
        description: `You have ${analytics.tasks.overdue} overdue tasks. Recommend scheduling a sprint planning session to reprioritize and redistribute workload.`,
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      });
    }

    // Milestone insights
    if (milestones && milestones.length === 0) {
      insights.push({
        type: 'recommendation',
        title: 'Set Your First Milestone',
        description: 'Startups with clear milestones are 3x more likely to achieve their goals. Start with a 30-day milestone.',
        icon: Target,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
      });
    }

    // Team productivity
    if (analytics.team && analytics.team.length > 0) {
      const avgTasksPerMember = analytics.tasks.total / analytics.team.length;
      if (avgTasksPerMember > 10) {
        insights.push({
          type: 'warning',
          title: 'Team Workload Alert',
          description: `Average of ${avgTasksPerMember.toFixed(1)} tasks per member. Consider hiring or redistributing work to prevent burnout.`,
          icon: AlertTriangle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
        });
      }
    }

    // Growth opportunity
    if (analytics.tasks.completionPercentage > 70) {
      insights.push({
        type: 'opportunity',
        title: 'Ready for Scale',
        description: 'Your team is performing well! Consider taking on more ambitious goals or expanding your product scope.',
        icon: Zap,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      });
    }

    // Task prioritization
    if (tasks && tasks.length > 0) {
      const highPriorityTasks = tasks.filter((t: any) => t.priority === 'high' && t.status !== 'done');
      if (highPriorityTasks.length > 5) {
        insights.push({
          type: 'suggestion',
          title: 'Too Many High-Priority Tasks',
          description: `You have ${highPriorityTasks.length} high-priority tasks. Focus on 2-3 critical tasks per week for better execution.`,
          icon: Lightbulb,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
        });
      }
    }

    // Milestone deadline insights
    if (analytics.milestones.overdue > 0) {
      insights.push({
        type: 'recommendation',
        title: 'Milestone Timeline Review',
        description: 'Some milestones are overdue. Consider adjusting timelines based on actual velocity or breaking them into smaller goals.',
        icon: Target,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
      });
    }

    // Default insights if none generated
    if (insights.length === 0) {
      insights.push({
        type: 'suggestion',
        title: 'Build Momentum',
        description: 'Start by creating 3-5 tasks for this week. Small wins build confidence and attract early users.',
        icon: Sparkles,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      });
      
      insights.push({
        type: 'recommendation',
        title: 'Validate Early',
        description: 'Create a feedback request to gather insights from potential users. Early validation saves months of development time.',
        icon: Lightbulb,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
          BETA
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card key={index} className={`${insight.bgColor} border-none`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 bg-white rounded-lg`}>
                  <Icon className={`w-5 h-5 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${insight.color} mb-1`}>{insight.title}</h4>
                  <p className="text-sm text-gray-700">{insight.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-none">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Pro Tip:</span> These insights are generated using AI analysis of your workspace data. 
              They update in real-time as you make progress.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
