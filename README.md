# Activity Feed Full-Stack Application

A complete full-stack application for managing real-time activity feeds with optimistic UI updates, infinite scroll pagination, and background job processing.

## 📋 Overview

This project consists of:

- **Frontend**: React + Vite application with real-time activity feed
- **Backend**: Express.js API with MongoDB, Redis queues, and job workers

## 🎯 Features

### Frontend

- Real-time activity feed with infinite scroll
- Optimistic UI updates for instant feedback
- Activity filtering by type
- Automatic polling for new activities
- Duplicate prevention
- Responsive design

### Backend

- RESTful API with Express.js
- MongoDB for data persistence
- Redis-based job queue (BullMQ) for background processing
- Activity worker for asynchronous task handling
- Multi-tenant support with tenant ID headers

## 🏗️ Project Structure

```
assignment/
├── backend/
│   ├── controller/
│   │   └── assignment.controller.js    # API request handlers
│   ├── model/
│   │   └── assignment.model.js         # MongoDB schemas
│   ├── routes/
│   │   └── assignment.routes.js        # API routes
│   ├── queue/
│   │   └── activityQueue.js            # BullMQ queue setup
│   ├── workers/
│   │   └── activityWorker.js           # Background job worker
│   ├── server.js                       # Express server entry point
│   ├── package.json
│   └── README.md                       # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActivityFeed.jsx        # Main feed component
│   │   │   ├── ActivityCard.jsx        # Activity card component
│   │   │   └── index.css               # Component styles
│   │   ├── App.jsx                     # Root component
│   │   ├── main.jsx                    # Entry point
│   │   └── assets/
│   ├── public/
│   │   ├── screenshots/                # Demo screenshots
│   │   └── favicon.svg
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── README.md                       # Frontend documentation
│
└── README.md                           # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- Redis (for job queue)
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (if needed)
# DATABASE_URL=mongodb://localhost:27017/assignment
# REDIS_URL=redis://localhost:6379

# Start development server
npm run dev

# Or start production
npm start
```

Backend runs on `http://localhost:3000` (or configured port)

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔌 API Endpoints

### Activities

#### Get Activities (with Pagination)

```http
GET /api/activities?limit=20&cursor=<nextCursor>&type=<filter>
Headers:
  x-tenant-id: company-abc
```

#### Create Activity

```http
POST /api/activities
Headers:
  Content-Type: application/json
  x-tenant-id: company-abc

Body:
{
  "actorId": "user-001",
  "actorName": "John Doe",
  "type": "like",
  "entityId": "post-123",
  "metadata": {}
}
```

## 🔄 How It Works

### Frontend Flow

1. **Load Activities**: Initial load fetches 20 activities with pagination cursor
2. **Infinite Scroll**: When user scrolls to bottom, next page is automatically fetched
3. **Real-time Polling**: Every 10 seconds, new activities are fetched and prepended
4. **Create Activity**:
   - Optimistic UI shows activity immediately
   - API call sent in background
   - On success: Replace with server response
   - On failure: Rollback and show error

### Backend Flow

1. **API Request**: Express receives request with tenant ID
2. **Database Query**: MongoDB returns activities with cursor
3. **Queue Job**: Activity creation triggers background job via BullMQ
4. **Worker Processing**: Worker processes job asynchronously
5. **Response**: API returns activity with new ID and timestamp

## 🛠️ Technology Stack

### Frontend

- React 18+
- Vite
- ESLint
- Intersection Observer API (for infinite scroll)

### Backend

- Express.js 5+
- MongoDB with Mongoose
- Redis with BullMQ
- Node.js

## 📝 Configuration

### Environment Variables (Backend)

```env
# Database
DATABASE_URL=mongodb://localhost:27017/assignment

# Redis
REDIS_URL=redis://localhost:6379

# Server
PORT=3000
NODE_ENV=development
```

### Environment Variables (Frontend)

```env
# Backend API
VITE_API_URL=http://localhost:3000

# Tenant ID
VITE_TENANT_ID=company-abc
```

## 🧪 Development

### Running Tests

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm test
```

### Building for Production

Frontend:

```bash
cd frontend
npm run build
```

## 📦 Dependencies

### Backend

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bullmq** - Job queue management
- **ioredis** - Redis client
- **dotenv** - Environment variables
- **nodemon** - Development server with auto-reload

### Frontend

- **react** - UI library
- **vite** - Build tool
- **eslint** - Code linting

## 🔒 Security Considerations

- ✅ Input validation on all endpoints
- ✅ Tenant ID isolation via headers
- ✅ MongoDB connection pooling
- ✅ Environment variable management
- ⚠️ Add CORS configuration for production
- ⚠️ Implement authentication/authorization
- ⚠️ Add rate limiting for API endpoints

## 📚 Documentation

- [Frontend Documentation](./frontend/README.md) - React app details
- [Backend Documentation](./backend/README.md) - Express API details

## 🐛 Troubleshooting

### Frontend Issues

- **Activities not loading?** Check if backend is running on correct port
- **Real-time updates not working?** Verify polling interval and network requests
- **Duplicate activities?** Deduplication logic should handle this automatically

### Backend Issues

- **MongoDB connection error?** Verify DATABASE_URL and MongoDB is running
- **Redis connection error?** Verify REDIS_URL and Redis is running
- **Job queue not processing?** Check worker logs for errors

## 📄 License

ISC

## 👤 Author

Assignment Project

---

**Need help?** Check the individual README files in the `frontend/` and `backend/` directories for more detailed information.
