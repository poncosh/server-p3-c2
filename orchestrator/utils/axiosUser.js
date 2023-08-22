const axios = require("axios");

const axiosUsers = axios.create({
  baseURL: process.env.USERS_API,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = axiosUsers;
