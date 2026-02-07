import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  // Google OAuth
  googleAuth: (token: string) => api.post('/auth/google', { token }),
  // OTP
  sendOTP: (data: { email: string; name?: string }) =>
    api.post('/auth/otp/send', data),
  verifyOTP: (data: { email: string; code: string }) =>
    api.post('/auth/otp/verify', data),
};

// Workspace API
export const workspaceAPI = {
  create: (data: any) => api.post('/workspaces', data),
  getAll: () => api.get('/workspaces'),
  getById: (id: string) => api.get(`/workspaces/${id}`),
  update: (id: string, data: any) => api.put(`/workspaces/${id}`, data),
  delete: (id: string) => api.delete(`/workspaces/${id}`),
};

// Task API
export const taskAPI = {
  create: (data: any) => api.post('/tasks', data),
  getByWorkspace: (workspaceId: string, params?: any) =>
    api.get(`/tasks/workspace/${workspaceId}`, { params }),
  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

// Milestone API
export const milestoneAPI = {
  create: (data: any) => api.post('/milestones', data),
  getByWorkspace: (workspaceId: string) =>
    api.get(`/milestones/workspace/${workspaceId}`),
  update: (id: string, data: any) => api.put(`/milestones/${id}`, data),
  delete: (id: string) => api.delete(`/milestones/${id}`),
};

// Feedback API
export const feedbackAPI = {
  createRequest: (data: any) => api.post('/feedback/request', data),
  submitFeedback: (shareableLink: string, data: any) =>
    api.post(`/feedback/submit/${shareableLink}`, data),
  getByWorkspace: (workspaceId: string) =>
    api.get(`/feedback/workspace/${workspaceId}`),
  markAddressed: (id: string) => api.put(`/feedback/${id}/address`),
};

// Analytics API
export const analyticsAPI = {
  getWorkspaceAnalytics: (workspaceId: string) =>
    api.get(`/analytics/workspace/${workspaceId}`),
};
