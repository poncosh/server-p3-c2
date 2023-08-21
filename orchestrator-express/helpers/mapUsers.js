const axiosUsers = require("../utils/axiosUser");

module.exports = (mongoIds) => {
  return Promise.all(
    mongoIds.map((mongoId) => {
      return axiosUsers.get(`/${mongoId}`);
    })
  ).then((mongoUser) => {
    return mongoUser;
  });
};
