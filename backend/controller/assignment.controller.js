// controllers/activityController.js
const Activity = require("../model/assignment.model")
const activityQueue = require('../queue/activityQueue');

// POST /activities — Create a new activity
const createActivity = async (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'];
    if (!tenantId) return res.status(400).json({ error: 'tenantId required' });

    const { actorId, actorName, type, entityId, metadata } = req.body;

    // ── IDEMPOTENCY KEY ──────────────────────────────────────
    // Client sends a unique key with every request (e.g. a UUID)
    // If the same key comes in twice, BullMQ ignores the duplicate
    // This prevents double-posting when user clicks button twice
    // or network retries the same request
    const idempotencyKey = req.headers['x-idempotency-key'];

    // Push job to queue — this is instant (Redis is in-memory)
    await activityQueue.add(
      'create-activity',          // job name
      { tenantId, actorId, actorName, type, entityId, metadata }, // job data
      {
        // Use idempotency key as jobId so duplicates are rejected
        jobId: idempotencyKey || undefined
      }
    );

    // Respond immediately — don't wait for MongoDB write
    // 202 Accepted = "we got it, processing in background"
    res.status(202).json({
      message: 'Activity queued successfully',
      status: 'processing'
    });
     } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /activities?cursor=<ISO_DATE>&limit=20 — Fetch feed with cursor pagination
const getActivities = async (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'];
    if (!tenantId) return res.status(400).json({ error: 'tenantId required' });

    const limit  = parseInt(req.query.limit) || 20;
    const cursor = req.query.cursor;  // ISO date string e.g. "2025-06-10T12:00:00Z"

    // Build the query — only this tenant's data
    const query = { tenantId };

    // If cursor exists, get activities OLDER than this date
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    // projection = only fetch fields we need (no joins needed)
    const activities = await Activity.find(query)
      .select('actorId actorName type entityId metadata createdAt')
      .sort({ createdAt: -1 })  // newest first
      .limit(limit);

    // Give the client a cursor to fetch the NEXT page
    const nextCursor = activities.length === limit
      ? activities[activities.length - 1].createdAt.toISOString()
      : null;

    res.json({ data: activities, nextCursor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createActivity, getActivities };