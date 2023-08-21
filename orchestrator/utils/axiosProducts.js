const axios = require("axios");

const axiosProducts = axios.create({
  baseURL: process.env.APP_API,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = axiosProducts;
