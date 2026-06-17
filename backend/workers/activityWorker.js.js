const { Worker } = require('bullmq');
const Activity = require('../model/assignment.model');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const redisConnection = { host: 'localhost', port: 6379 };

const worker = new Worker(
  'activities',
  async (job) => {
    console.log(`Processing job ${job.id}...`);

    const { tenantId, actorId, actorName, type, entityId, metadata } = job.data;

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
    concurrency: 5
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed after all retries:`, err.message);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

console.log('Worker started, listening for jobs...');