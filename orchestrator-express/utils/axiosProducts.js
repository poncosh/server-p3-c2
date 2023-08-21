const axios = require("axios");

const axiosProducts = axios.create({
  baseURL: "https://p3c1.poncosh.space",
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = axiosProducts;
