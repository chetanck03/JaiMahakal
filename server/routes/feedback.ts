import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Create feedback request
router.post('/request', authenticate, async (req: AuthRequest, res) => {
  try {
    const { workspaceId, title, description } = req.body;

    if (!workspaceId || !title) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Workspace ID and title are required' },
      });
    }

    const feedbackRequest = await prisma.feedbackRequest.create({
      data: { workspaceId, title, description },
    });

    res.status(201).json(feedbackRequest);
  } catch (error) {
    console.error('Create feedback request error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to create feedback request' } });
  }
});

// Submit feedback (public - no auth)
router.post('/submit/:shareableLink', async (req, res) => {
  try {
    const { shareableLink } = req.params;
    const { content, rating, category } = req.body;

    if (!content) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Content is required' },
      });
    }

    const feedbackRequest = await prisma.feedbackRequest.findUnique({
      where: { shareableLink },
    });

    if (!feedbackRequest || !feedbackRequest.isActive) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Feedback request not found or inactive' },
      });
    }

    const feedback = await prisma.feedback.create({
      data: {
        feedbackRequestId: feedbackRequest.id,
        content,
        rating,
        category,
      },
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to submit feedback' } });
  }
});

// Get feedback by workspace
router.get('/workspace/:workspaceId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { workspaceId } = req.params;

    const feedbackRequests = await prisma.feedbackRequest.findMany({
      where: { workspaceId },
      include: {
        feedback: {
          orderBy: { submittedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(feedbackRequests);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to get feedback' } });
  }
});

// Mark feedback as addressed
router.put('/:id/address', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const feedback = await prisma.feedback.update({
      where: { id },
      data: {
        isAddressed: true,
        addressedAt: new Date(),
      },
    });

    res.json(feedback);
  } catch (error) {
    console.error('Address feedback error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to address feedback' } });
  }
});

export default router;
