# Backend - Activity Feed API

Express.js backend for the Activity Feed application, featuring MongoDB integration, Redis-based job queues, and background worker processing.

## 🎯 Overview

This backend provides RESTful APIs for managing activities with:

- Cursor-based pagination
- Activity filtering by type
- Background job processing via BullMQ
- MongoDB persistence
- Multi-tenant support

## 📂 Project Structure

```
backend/
├── controller/
│   └── assignment.controller.js    # Route handlers & business logic
├── model/
│   └── assignment.model.js         # MongoDB schemas & models
├── routes/
│   └── assignment.routes.js        # API route definitions
├── queue/
│   └── activityQueue.js            # BullMQ queue configuration
├── workers/
│   └── activityWorker.js           # Background job processor
├── server.js                       # Express server setup
├── package.json                    # Dependencies
└── README.md                       # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- MongoDB (local or MongoDB Atlas)
- Redis (for job queue)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file with configuration (optional)
# DATABASE_URL=mongodb://localhost:27017/assignment
# REDIS_URL=redis://localhost:6379
# PORT=3000

# Start development server
npm run dev

# Or start production server
npm start
```

Server runs on `http://localhost:3000` by default.

## 📡 API Endpoints

### Get Activities (Paginated)

```http
GET /api/activities?limit=20&cursor=NEXT_CURSOR&type=FILTER_TYPE
```

**Headers:**

```
x-tenant-id: company-abc
```

**Query Parameters:**

- `limit` (optional): Number of activities per page (default: 20, max: 100)
- `cursor` (optional): Pagination cursor from previous response
- `type` (optional): Filter by activity type - `like`, `comment`, or `share`

**Response:**

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "actorId": "user-001",
      "actorName": "Binay Kumar",
      "type": "share",
      "entityId": "post-1781666476994",
      "createdAt": "2026-06-17T08:51:17.000Z",
      "metadata": {}
    }
  ],
  "nextCursor": "507f1f77bcf86cd799439012"
}
```

**Status Codes:**

- `200` - Success
- `400` - Invalid query parameters
- `500` - Server error

---

### Create Activity

```http
POST /api/activities
```

**Headers:**

```
Content-Type: application/json
x-tenant-id: company-abc
```

**Request Body:**

```json
{
  "actorId": "user-001",
  "actorName": "Binay Kumar",
  "type": "like",
  "entityId": "post-1781666476994",
  "metadata": {
    "customField": "value"
  }
}
```

**Response:**

```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "actorId": "user-001",
    "actorName": "Binay Kumar",
    "type": "like",
    "entityId": "post-1781666476994",
    "createdAt": "2026-06-17T08:51:17.000Z",
    "metadata": {}
  }
}
```

**Status Codes:**

- `201` - Activity created
- `400` - Validation error
- `500` - Server error

---

## 🗄️ Database Schema

### Activity Model

```javascript
{
  _id: ObjectId,              // MongoDB auto-generated ID
  tenantId: String,           // Multi-tenant isolation
  actorId: String,            // User who performed the action
  actorName: String,          // User's display name
  type: String,               // 'like', 'comment', 'share'
  entityId: String,           // ID of the entity (post, etc.)
  metadata: Object,           // Custom metadata
  createdAt: Date,            // Timestamp
  updatedAt: Date             // Last update
}
```

### Indexes

- `tenantId + createdAt DESC` - For efficient pagination queries
- `tenantId + type` - For filtered queries
- `entityId` - For entity-based lookups

## 🔄 Background Processing

### Job Queue (BullMQ + Redis)

Activities trigger background jobs for:

- Email notifications
- Analytics processing
- Cache invalidation
- Webhook dispatching

### Activity Worker

The worker processes jobs from the queue:

```javascript
// Example job format
{
  id: "job-123",
  data: {
    activityId: "507f1f77bcf86cd799439011",
    type: "ACTIVITY_CREATED",
    tenantId: "company-abc"
  }
}
```

**Processing Steps:**

1. Receive job from queue
2. Process activity (notifications, analytics, etc.)
3. Update job status
4. Retry on failure with exponential backoff

## 🔐 Multi-Tenancy

All requests require `x-tenant-id` header for tenant isolation:

```http
x-tenant-id: company-abc
```

**Usage in Code:**

```javascript
const tenantId = req.headers["x-tenant-id"];
const activities = await Activity.find({ tenantId });
```

This ensures data isolation across different tenants.

## 🛠️ File Details

### server.js

- Express app setup
- Middleware configuration (body-parser, headers, etc.)
- Route mounting
- Error handling
- Server initialization

### assignment.routes.js

- `GET /api/activities` - Fetch activities with pagination
- `POST /api/activities` - Create new activity

### assignment.controller.js

- `getActivities()` - Query MongoDB with cursor pagination
- `createActivity()` - Save activity and queue job

### assignment.model.js

- Activity schema definition
- Model compilation
- Indexes for performance

### activityQueue.js

- BullMQ queue initialization
- Connection to Redis
- Queue event listeners

### activityWorker.js

- Job processor implementation
- Error handling
- Retry logic

## 📊 Pagination

The API uses **cursor-based pagination** for efficiency:

1. **First Request:**

```http
GET /api/activities?limit=20
```

2. **Subsequent Requests:**

```http
GET /api/activities?limit=20&cursor=RETURNED_NEXT_CURSOR
```

3. **Response Includes:**

```json
{
  "data": [...],
  "nextCursor": "507f1f77bcf86cd799439050"
}
```

**Advantages:**

- ✅ Handles insertions/deletions gracefully
- ✅ Efficient database queries
- ✅ Prevents N+1 problems
- ✅ Works well with real-time updates

## 🔍 Filtering

Filter activities by type:

```http
GET /api/activities?type=like
GET /api/activities?type=comment
GET /api/activities?type=share
```

Combine with pagination:

```http
GET /api/activities?type=like&limit=20&cursor=CURSOR
```

## 📝 Logging

Recommended logging setup:

- Use `morgan` for HTTP request logging
- Use `winston` or `bunyan` for application logging
- Log all errors with stack traces
- Log job queue events

## 🚨 Error Handling

**Standard Error Response:**

```json
{
  "error": "Description of error",
  "code": "ERROR_CODE"
}
```

**Common Errors:**

- `400` - Missing required fields, invalid tenant ID
- `404` - Activity not found
- `500` - Database or server error

## ⚙️ Configuration

### Environment Variables

```env
# Database
DATABASE_URL=mongodb://localhost:27017/assignment
# or for MongoDB Atlas:
# DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/assignment

# Redis (for BullMQ)
REDIS_URL=redis://localhost:6379
# or for Redis Cloud:
# REDIS_URL=redis://user:password@host:port

# Server
PORT=3000
NODE_ENV=development
```

### Connection Pooling

- MongoDB: Connection pooling enabled by default (maxPoolSize: 10)
- Redis: Single connection reused across queues

## 🔄 Workflow Example

```
1. Client POST /api/activities
   ↓
2. Controller validates input
   ↓
3. Activity saved to MongoDB
   ↓
4. Job queued in Redis via BullMQ
   ↓
5. Response sent to client (201)
   ↓
6. Worker picks up job from queue
   ↓
7. Background processing (emails, analytics, etc.)
   ↓
8. Job marked complete or failed
```

## 📈 Performance Tips

- Use pagination with reasonable limits (20-100 items)
- Create indexes on frequently queried fields
- Monitor job queue for bottlenecks
- Use Redis clustering for high traffic
- Implement rate limiting

## 🧪 Testing

Add tests for:

- Route handlers
- Database queries
- Job processing
- Error cases

```bash
npm test
```

## 📚 Dependencies

| Package  | Purpose            |
| -------- | ------------------ |
| express  | Web framework      |
| mongoose | MongoDB ODM        |
| bullmq   | Job queue          |
| ioredis  | Redis client       |
| dotenv   | Environment config |
| nodemon  | Dev auto-reload    |

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Ensure MongoDB is running or update DATABASE_URL

### Redis Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solution:** Ensure Redis is running or update REDIS_URL

### Job Queue Not Processing

- Check Redis connection
- Check worker logs for errors
- Verify job format in controller

### Slow Pagination Queries

- Ensure indexes are created
- Check query performance with explain()
- Consider denormalization for frequently accessed data

## 📄 License

ISC

---

**Questions?** Check the main [README.md](../README.md) for full project overview.
