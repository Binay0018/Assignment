// workers/activityWorker.js
const { Worker } = require('bullmq');
const Activity = require('../model/assignment.model');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect worker to MongoDB
mongoose.connect(process.env.MONGO_URI);

const redisConnection = { host: 'localhost', port: 6379 };

// Create the worker — it listens to the "activities" queue
const worker = new Worker(
  'activities',                   // same queue name as producer

  // This function runs for every job
  async (job) => {
    console.log(`Processing job ${job.id}...`);

    const { tenantId, actorId, actorName, type, entityId, metadata } = job.data;

    // Write to MongoDB — this is the actual database operation
    await Activity.create({
      tenantId,
      actorId,
      actorName,
      type,
      entityId,
      metadata
    });

    console.log(`Job ${job.id} done — activity saved`);
  },

  {
    connection: redisConnection,
    concurrency: 5   // process up to 5 jobs at the same time
  }
);

// ── Event listeners for monitoring ──────────────────────
worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  // This fires after all retries are exhausted
  console.error(`Job ${job.id} failed after all retries:`, err.message);
  // In production: send alert to Slack/PagerDuty here
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

console.log('Worker started, listening for jobs...');