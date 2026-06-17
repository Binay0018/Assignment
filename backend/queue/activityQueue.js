const { Queue } = require('bullmq');

const redisConnection = {
  host: 'localhost',
  port: 6379
};

const activityQueue = new Queue('activities', {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: 100,
    removeOnFail: 500
  }
});

module.exports = activityQueue;