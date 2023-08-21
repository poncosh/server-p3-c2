const Redis = require("ioredis");

const redis = new Redis({
  port: 14064,
  host: "redis-14064.c252.ap-southeast-1-1.ec2.cloud.redislabs.com",
  username: "default",
  password: "gO93InAfmKaU1YzvLE4WsI10AEnNRg9N",
});

module.exports = redis;
