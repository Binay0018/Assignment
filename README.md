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

Backend runs on `http://localhost:5000` by default

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server (with API proxy to :5000)
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔌 API Endpoints

### GET /api/activities

Fetch activities with cursor-based pagination:

```bash
curl "http://localhost:5000/api/activities?limit=20&cursor=2026-06-17T08:51:17.000Z" \
  -H "x-tenant-id: company-abc"
```

**Response (200):**

```json
{
  "data": [
    {
      "_id": "6a32008e60d77f87f0a1670a",
      "tenantId": "company-abc",
      "actorId": "user-001",
      "actorName": "Binay Kumar",
      "type": "share",
      "entityId": "post-1781666476994",
      "createdAt": "2026-06-17T08:51:17.000Z"
    }
  ],
  "nextCursor": "2026-06-17T08:51:16.000Z"
}
```

### POST /api/activities

Create activity (asynchronously via BullMQ queue):

```bash
curl -X POST "http://localhost:5000/api/activities" \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: company-abc" \
  -H "x-idempotency-key: unique-uuid" \
  -d '{
    "actorId": "user-001",
    "actorName": "Binay Kumar",
    "type": "like",
    "entityId": "post-123",
    "metadata": {}
  }'
```

**Response (202 Accepted):**

```json
{
  "message": "Activity queued successfully",
  "status": "processing"
}
```

## 🔄 How It Works

### Frontend Architecture

1. **Infinite Scroll** - Uses Intersection Observer to detect scroll to bottom, fetches next page with cursor
2. **Real-time Polling** - Every 10s polls for new activities, deduplicates by `_id`
3. **Optimistic UI** - Shows temp activity instantly, replaces with real one after polling detects it
4. **Duplicate Prevention** - Tracks `_id` set to prevent duplicates across pagination and polling

### Backend Architecture

1. **API Validation** - Check `x-tenant-id` header and request body
2. **Queue Job** - Add to BullMQ Redis queue, return 202 immediately
3. **Background Worker** - Listen for jobs, save to MongoDB, retry 3x with backoff
4. **Pagination Query** - Index `{tenantId, createdAt DESC}` for fast cursor pagination

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
# Database MongoDB
MONGO_URI=mongodb://localhost:27017/assignment

# Redis for BullMQ queue
REDIS_URL=redis://localhost:6379

# Server
PORT=5000
NODE_ENV=development
```

### Environment Variables (Frontend)

```env
# Backend API URL
VITE_API_URL=http://localhost:5000

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
