# Activity Feed Application

A real-time activity feed application built with React and Vite, featuring optimistic UI updates, infinite scroll pagination, and real-time activity polling.

## Features

- 🚀 **Real-time Activity Updates** - Polling every 10 seconds for new activities
- ♾️ **Infinite Scroll** - Automatically load more activities as you scroll
- ⚡ **Optimistic UI** - Activities appear instantly before API confirmation
- 🎯 **Activity Filtering** - Filter activities by type (like, comment, share)
- 🔄 **Deduplication** - Smart duplicate prevention across loads and polling
- 🎨 **Responsive Design** - Mobile-friendly interface

## Tech Stack

- **Frontend**: React 18+ with Vite
- **Styling**: CSS-in-JS (inline styles)
- **Build Tool**: Vite
- **Linting**: ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ActivityFeed.jsx      # Main feed component with infinite scroll & polling
│   │   ├── ActivityCard.jsx      # Individual activity card display
│   │   └── index.css             # Global styles
│   ├── App.jsx                   # Root app component
│   ├── main.jsx                  # Entry point
│   ├── index.css                 # Global stylesheet
│   └── assets/                   # Static assets
├── public/                        # Static files
├── package.json                  # Dependencies
├── vite.config.js                # Vite configuration
└── eslint.config.js              # ESLint rules
```

## Setup Instructions

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd assignment/frontend
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## API Endpoints

### Fetch Activities

```
GET /api/activities?limit=20&cursor=<nextCursor>&type=<filter>
```

**Headers:**

- `x-tenant-id: company-abc`

**Query Parameters:**

- `limit`: Number of activities to fetch (default: 20)
- `cursor`: Pagination cursor for next page
- `type`: Filter by activity type (like, comment, share)

**Response:**

```json
{
  "data": [
    {
      "_id": "6a32008e60d77f87f0a1670a",
      "actorId": "user-001",
      "actorName": "Binay Kumar",
      "type": "share",
      "entityId": "post-1781666476994",
      "createdAt": "2026-06-17T08:51:17.000Z",
      "metadata": {}
    }
  ],
  "nextCursor": "6a32008e60d77f87f0a1670b"
}
```

### Create Activity (Optimistic UI)

```
POST /api/activities
```

**Headers:**

- `Content-Type: application/json`
- `x-tenant-id: company-abc`

**Request Body:**

```json
{
  "actorId": "user-001",
  "actorName": "Binay Kumar",
  "type": "like",
  "entityId": "post-1781666476994",
  "metadata": {}
}
```

## Components

### ActivityFeed Component

The main component managing:

- Real-time polling (every 10 seconds)
- Infinite scroll with Intersection Observer API
- Activity creation with optimistic updates
- Activity filtering by type
- Duplicate detection and prevention

### ActivityCard Component

Displays individual activity with:

- Actor information
- Activity type and metadata
- Entity reference
- Timestamp formatting

## Key Features Explained

### Optimistic UI Updates

When you post an activity:

1. Temporary activity appears instantly with a temp ID
2. API request is sent in the background
3. On success, temp activity is replaced with server response
4. On failure, temp activity is removed with error notification

### Infinite Scroll

- Uses Intersection Observer API to detect when user scrolls to bottom
- Automatically fetches next batch of activities
- Prevents duplicate loads with cursor-based pagination

### Real-time Polling

- Checks for new activities every 10 seconds
- Only adds genuinely new items (deduplicates by \_id)
- Non-intrusive background updates

## Error Handling

- **Failed Activity Creation**: Optimistic update is rolled back with user notification
- **Invalid API Responses**: Graceful handling with null/undefined checks
- **Fetch Errors**: Logged to console with graceful degradation

## Development Notes

- The application uses cursor-based pagination for efficient data fetching
- Tenant ID (`company-abc`) is used for multi-tenancy support
- All activities are deduplicated by `_id` to prevent duplicates
- Component uses refs for intersection observer and DOM manipulation

## Screenshots

![Activity Feed](./public/screenshots/activity-feed-demo.png)

_Activity Feed showing real-time updates with filtering options_
