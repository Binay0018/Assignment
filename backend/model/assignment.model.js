const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  tenantId:   { type: String, required: true },
  actorId:    { type: String, required: true },
  actorName:  { type: String, required: true },
  type:       { type: String, required: true },  // e.g. 'comment', 'like', 'share'
  entityId:   { type: String, required: true },  // e.g. post ID
  metadata:   { type: Object, default: {} },     // any extra info
  createdAt:  { type: Date, default: Date.now }
});

// This compound index is KEY — tenantId first, then createdAt
// MongoDB uses this to quickly find all activities for a tenant, sorted by time
activitySchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);