"use strict";
const { getDb } = require("../config/connect");
const users = require("../users/user.json");
const bcrypt = require("bcryptjs");

const seedingUser = async () => {
  try {
    const data = users.map((el) => ({
      insertOne: { document: el },
    }));

    await getDb().collection("users").bulkWrite(data);
  } catch (error) {
    console.log(error);
  }
};

seedingUser();
