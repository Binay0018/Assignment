# Development Guide

Complete setup and development guide for the Activity Feed Application.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Running the Application](#running-the-application)
4. [Architecture](#architecture)
5. [Common Tasks](#common-tasks)
6. [Debugging](#debugging)
7. [Code Standards](#code-standards)

## 📦 Prerequisites

### Required

- **Node.js**: v16 or higher
- **npm**: v8 or higher
- **MongoDB**: Local or MongoDB Atlas account
- **Redis**: Local or Redis Cloud account
- **Git**: For version control

### Optional

- Docker & Docker Compose (for containerized setup)
- Postman (for API testing)
- MongoDB Compass (for database visualization)

### Installation

**macOS (Homebrew)**

```bash
brew install node
brew install mongodb-community
brew install redis
```

**Ubuntu/Debian**

```bash
# Node.js
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get install -y mongodb-org

# Redis
sudo apt-get install -y redis-server
```

**Windows**

- Node.js: Download from [nodejs.org](https://nodejs.org)
- MongoDB: Use [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Redis: Use [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/) or Docker

## 🚀 Project Setup

### Clone Repository

```bash
git clone <repository-url>
cd assignment
```

### Install Dependencies

**Using npm workspaces (Recommended):**

```bash
npm install
```

**Or manually:**

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Environment Configuration

**Backend (.env)**

```bash
cd backend
cat > .env << EOF
# MongoDB
DATABASE_URL=mongodb://localhost:27017/assignment

# Redis
REDIS_URL=redis://localhost:6379

# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
EOF
```

**Frontend (.env.local)** (optional, Vite config has defaults)

```bash
cd ../frontend
cat > .env.local << EOF
VITE_API_URL=http://localhost:3000
VITE_TENANT_ID=company-abc
EOF
```

### Verify Services

**Check MongoDB Connection**

```bash
mongosh --eval "db.version()"
```

**Check Redis Connection**

```bash
redis-cli ping
# Response: PONG
```

## ▶️ Running the Application

### Option 1: Separate Terminals (Recommended for Development)

**Terminal 1 - Backend**

```bash
cd backend
npm run dev
# Server running on http://localhost:3000
```

**Terminal 2 - Frontend**

```bash
cd frontend
npm run dev
# Frontend running on http://localhost:5173
```

**Terminal 3 - Monitor Activity Worker**

```bash
cd backend
node workers/activityWorker.js
```

### Option 2: Using npm Workspaces (All in One)

```bash
# From root directory
npm run dev
# Both servers start simultaneously
```

### Option 3: Docker Compose

```bash
docker-compose up -d
# All services start in background
```

View logs:

```bash
docker-compose logs -f
```

## 🏗️ Architecture

### Frontend Architecture

```
ActivityFeed Component
├── useEffect #1: Load on mount, reset on filter
├── useEffect #2: Infinite scroll with IntersectionObserver
├── useEffect #3: Real-time polling (10s interval)
├── createActivity(): Optimistic UI handler
├── loadMore(): Cursor-based pagination
└── Render
    ├── Create Activity Buttons
    ├── Filter Buttons
    ├── Activity List (ActivityCard components)
    └── Loading / Empty States
```

### Backend Architecture

```
Express App
├── Routes
│   └── /api/activities
│       ├── GET - List with pagination
│       └── POST - Create activity
├── Controllers
│   ├── getActivities()
│   └── createActivity()
├── Models
│   └── Activity (MongoDB Schema)
├── Queue
│   └── BullMQ Queue
└── Worker
    └── Process background jobs
```

### Data Flow

**Get Activities:**

```
Client → GET /api/activities → Controller
       → MongoDB Query → Response (data + nextCursor)
```

**Create Activity:**

```
Client → POST /api/activities → Controller
      → MongoDB Insert → Queue Job
      → Return Response → Worker processes in background
```

## 🛠️ Common Tasks

### Adding a New Activity Type

1. **Update Frontend** (ActivityFeed.jsx)

```javascript
const type = "new-type"; // Add to button list
```

2. **Backend Validation** (assignment.controller.js)

```javascript
const ACTIVITY_TYPES = ["like", "comment", "share", "new-type"];
```

3. **Test via API**

```bash
curl -X POST http://localhost:3000/api/activities \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: company-abc" \
  -d '{
    "actorId": "user-001",
    "actorName": "Test User",
    "type": "new-type",
    "entityId": "post-123",
    "metadata": {}
  }'
```

### Testing Activities Endpoint

**Using curl:**

```bash
# Get activities
curl http://localhost:3000/api/activities \
  -H "x-tenant-id: company-abc"

# Create activity
curl -X POST http://localhost:3000/api/activities \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: company-abc" \
  -d '{
    "actorId": "user-001",
    "actorName": "John",
    "type": "like",
    "entityId": "post-1",
    "metadata": {}
  }'
```

**Using Postman:**

1. Create new collection
2. Add requests for GET/POST /api/activities
3. Set headers: `x-tenant-id: company-abc`
4. Use raw JSON for body

### Checking MongoDB Data

**Using mongosh:**

```bash
mongosh

> use assignment
> db.activities.find().pretty()
> db.activities.countDocuments()
> db.activities.findOne()
```

**Using MongoDB Compass:**

1. Connect to `mongodb://localhost:27017`
2. Select `assignment` database
3. View `activities` collection

### Checking Redis Queue

```bash
redis-cli

> INFO
> KEYS activity:*
> LLEN activity:queue
```

## 🐛 Debugging

### Enable Debug Logging

**Backend:**

```javascript
// In server.js
const DEBUG = process.env.DEBUG === "true";

if (DEBUG) {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}
```

Run with debug:

```bash
DEBUG=true npm run dev
```

### Frontend Debugging

**React DevTools:**

1. Install [React DevTools Extension](https://chrome.google.com/webstore/detail/react-developer-tools)
2. Open DevTools (F12)
3. Go to React tab
4. Inspect components

**Console Logging:**

```javascript
// Already in code
console.log("Activities:", activities);
console.error("Fetch error:", err);
```

### Network Debugging

**Browser DevTools (Network Tab):**

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Watch API calls to `/api/activities`

**Backend Request Logging:**

```bash
npm install morgan
```

Add to server.js:

```javascript
const morgan = require("morgan");
app.use(morgan("combined"));
```

### Common Issues

**Issue: "Cannot read properties of undefined"**

- Check if API response is valid
- Verify MongoDB data structure
- Check console.log before access

**Issue: Duplicate Activities**

- Check deduplication logic in frontend
- Verify `_id` uniqueness in MongoDB
- Check polling interval (should be 10s)

**Issue: Slow Performance**

- Check MongoDB indexes
- Monitor Redis queue size
- Profile with DevTools Performance tab

## 📋 Code Standards

### File Organization

```
component/
├── index.jsx or ComponentName.jsx
├── ComponentName.module.css (if large)
└── (subcomponents if needed)
```

### Naming Conventions

**Files:**

- Components: PascalCase (ActivityFeed.jsx)
- Utils: camelCase (fetchActivities.js)
- Constants: UPPER_SNAKE_CASE (CONFIG.js)

**Variables:**

```javascript
// Components
const MyComponent = () => {};

// Functions
const fetchData = async () => {};

// Constants
const MAX_ITEMS = 100;

// Variables
let loading = false;
const activities = [];
```

### React Best Practices

```javascript
// ✅ Good
const ActivityFeed = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Cleanup function
    return () => {
      // cleanup
    };
  }, [dependencies]);

  return <div>{/* JSX */}</div>;
};

// ❌ Avoid
const activityFeed = () => {
  useState([]);
  // No cleanup
  // Wrong naming
};
```

### Error Handling

```javascript
// Frontend
try {
  const res = await fetch("/api/activities");
  if (!res.ok) throw new Error("Failed to fetch");
  return await res.json();
} catch (err) {
  console.error("Fetch error:", err);
  throw err;
}

// Backend
res.status(500).json({ error: "Internal Server Error" });
```

## 🚀 Deployment Preparation

### Before Deploying

1. **Update Environment Variables**
   - Production MongoDB URL
   - Production Redis URL
   - API URLs

2. **Build Frontend**

   ```bash
   cd frontend
   npm run build
   ```

3. **Run Tests**

   ```bash
   npm test
   ```

4. **Check Logs**
   ```bash
   npm run dev 2>&1 | tee app.log
   ```

### Production Checklist

- [ ] Environment variables configured
- [ ] MongoDB indexes created
- [ ] Redis persistence enabled
- [ ] Error logging setup
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Authentication/Authorization added
- [ ] Database backups configured
- [ ] Monitoring setup (New Relic, DataDog, etc.)
- [ ] CI/CD pipeline configured

## 📞 Getting Help

- Check individual README files
- Review error messages carefully
- Check browser console and Network tab
- Check backend logs
- Create GitHub issues with:
  - Error message
  - Steps to reproduce
  - Environment details (OS, Node version, etc.)

---

**Happy coding!** 🎉
