# StartupOps Platform

A unified digital platform for early-stage founders to manage execution, validate ideas, collaborate with teams, and gain actionable insights.

npx prisma db push

## 🚀 Features

### Core Modules
- **Authentication & Authorization** - Secure JWT-based auth with role-based access
- **Workspace Management** - Create and manage startup workspaces
- **Task & Milestone Tracking** - Organize work with tasks and milestones
- **Feedback System** - Collect and analyze feedback from stakeholders
- **Analytics Dashboard** - Data-driven insights on progress and performance

### Bonus Features
- **AI-Based Insights** - Smart suggestions for tasks and growth
- **Pitch Generator** - Auto-generate investor pitch outlines
- **Real-time Collaboration** - Live updates via WebSocket

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS
- React Query
- Zustand
- Socket.io Client
- Recharts

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- Socket.io
- bcrypt

## 📋 Prerequisites

- Node.js 18+ (you have v25.2.1 ✅)
- PostgreSQL database
- npm or yarn

## 🔧 Local Development Setup

### Frontend Setup (This Repo)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Start frontend**
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:3000

### Backend Setup (Server Folder)

1. **Navigate to server folder**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL URL
   npm run db:push
   ```

4. **Start backend**
   ```bash
   npm run dev
   ```
   Backend runs on http://localhost:3001

### Run Both Together

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
npm run dev
```

## 🚀 Deployment

This project is designed for separate deployment:
- **Frontend** → Vercel
- **Backend** → Render

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📁 Project Structure

```
startupops/
├── app/                    # Next.js app directory (frontend)
│   ├── (auth)/            # Auth pages (login, register)
│   ├── dashboard/         # Dashboard pages
│   └── workspace/         # Workspace pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Auth components
│   └── workspace/        # Workspace components
├── lib/                   # Frontend utilities
│   ├── api.ts            # API client
│   └── stores/           # Zustand stores
├── server/                # Backend (Deploy to Render)
│   ├── index.ts          # Server entry point
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── prisma/           # Database schema
│   ├── package.json      # Backend dependencies
│   └── DEPLOY.md         # Render deployment guide
├── public/               # Static assets
├── package.json          # Frontend dependencies
└── DEPLOYMENT.md         # Full deployment guide
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Workspaces
- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces` - List user workspaces
- `GET /api/workspaces/:id` - Get workspace details
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/workspace/:workspaceId` - Get workspace tasks
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Milestones
- `POST /api/milestones` - Create milestone
- `GET /api/milestones/workspace/:workspaceId` - Get workspace milestones
- `PUT /api/milestones/:id` - Update milestone
- `DELETE /api/milestones/:id` - Delete milestone

### Feedback
- `POST /api/feedback/request` - Create feedback request
- `POST /api/feedback/submit/:shareableLink` - Submit feedback (public)
- `GET /api/feedback/workspace/:workspaceId` - Get workspace feedback
- `PUT /api/feedback/:id/address` - Mark feedback as addressed

### Analytics
- `GET /api/analytics/workspace/:workspaceId` - Get workspace analytics

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run Prisma Studio to inspect database
npm run db:studio
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

**Quick Overview:**
- **Frontend** → Deploy to Vercel (auto-detects Next.js)
- **Backend** → Deploy to Render (set root directory to `server`)

Both platforms offer free tiers perfect for getting started!

## 📝 Environment Variables

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Backend (server/.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/startupops
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🐛 Troubleshooting

### Backend won't start
```bash
cd server
npm install
npm run db:push
npm run dev
```

### Frontend can't connect to backend
- Check backend is running on port 3001
- Verify NEXT_PUBLIC_API_URL in .env

### Database issues
```bash
cd server
npm run db:push -- --force-reset
```

## 📚 Next Steps

1. **Backend Setup** - `cd server && npm install && npm run db:push`
2. **Frontend Setup** - `npm install`
3. **Start Backend** - `cd server && npm run dev`
4. **Start Frontend** - `npm run dev` (in new terminal)
5. **Register** - Create account at http://localhost:3000
6. **Deploy** - See DEPLOYMENT.md for Vercel + Render setup

## 🤝 Contributing

This is a hackathon project. Feel free to fork and improve!

## 📄 License

MIT License - feel free to use this project for your startup!

---

Built with ❤️ for early-stage founders
