const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_STRING_URI);

module.exports = redis;
