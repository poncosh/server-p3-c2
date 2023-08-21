const axios = require("axios");

const axiosUsers = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = axiosUsers;
