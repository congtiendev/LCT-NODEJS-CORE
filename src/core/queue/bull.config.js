const Bull = require('bull');
const logger = require('@utils/logger');

const createQueue = (name, options = {}) => {
  const queue = new Bull(name, {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    },
    ...options,
  });

  queue.on('error', (error) => {
    logger.error(`Queue ${name} error:`, error);
  });

  queue.on('failed', (job, err) => {
    logger.error(`Job ${job.id} in queue ${name} failed:`, err);
  });

  queue.on('completed', (job) => {
    logger.info(`Job ${job.id} in queue ${name} completed`);
  });

  return queue;
};

const emailQueue = createQueue('email');
const notificationQueue = createQueue('notification');

module.exports = {
  createQueue,
  emailQueue,
  notificationQueue,
};
