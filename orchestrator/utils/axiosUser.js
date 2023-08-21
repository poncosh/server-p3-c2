const axios = require("axios");

const axiosUsers = axios.create({
  baseURL: process.env.USER_API,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = axiosUsers;
