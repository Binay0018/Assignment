// queues/activityQueue.js
const { Queue } = require('bullmq');

// Redis connection config
const redisConnection = {
  host: 'localhost',
  port: 6379
};

// Create a named queue called "activities"
// Think of it like a named conveyor belt
const activityQueue = new Queue('activities', {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 3,              // retry failed jobs up to 3 times
    backoff: {
      type: 'exponential',   // wait longer between each retry
      delay: 1000            // 1st retry after 1s, 2nd after 2s, 3rd after 4s
    },
    removeOnComplete: 100,   // keep last 100 completed jobs for inspection
    removeOnFail: 500        // keep last 500 failed jobs for debugging
  }
});

module.exports = activityQueue;