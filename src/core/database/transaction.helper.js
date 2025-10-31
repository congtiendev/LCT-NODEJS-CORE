const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const executeTransaction = async (callback) => {
  return prisma.$transaction(callback);
};

module.exports = {
  executeTransaction,
};
