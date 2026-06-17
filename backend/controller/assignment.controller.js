const Activity = require("../model/assignment.model")
const activityQueue = require('../queue/activityQueue');

const createActivity = async (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'];
    if (!tenantId) return res.status(400).json({ error: 'tenantId required' });

    const { actorId, actorName, type, entityId, metadata } = req.body;

    const idempotencyKey = req.headers['x-idempotency-key'];

    await activityQueue.add(
      'create-activity',
      { tenantId, actorId, actorName, type, entityId, metadata },
      {
        jobId: idempotencyKey || undefined
      }
    );

    res.status(202).json({
      message: 'Activity queued successfully',
      status: 'processing'
    });
     } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getActivities = async (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'];
    if (!tenantId) return res.status(400).json({ error: 'tenantId required' });

    const limit  = parseInt(req.query.limit) || 20;
    const cursor = req.query.cursor;

    const query = { tenantId };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const activities = await Activity.find(query)
      .select('actorId actorName type entityId metadata createdAt')
      .sort({ createdAt: -1 })
      .limit(limit);

    const nextCursor = activities.length === limit
      ? activities[activities.length - 1].createdAt.toISOString()
      : null;

    res.json({ data: activities, nextCursor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createActivity, getActivities };