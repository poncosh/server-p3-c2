const { getDb } = require("../config/connect");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const { signToken } = require("../helpers/jwt");

const register = async (req, res, next) => {
  try {
    const { username, email, password, phoneNumber, address } = req.body;

    await getDb()
      .collection("users")
      .insertOne({
        username,
        email,
        password: await bcrypt.hash(password, 10),
        phoneNumber,
        address,
      });

    res.status(201).json({
      message: "Success adding data",
    });
  } catch (error) {
    next(error);
  }
};

const readUser = async (req, res, next) => {
  try {
    const { mongoId } = req.params;

    const user = await getDb()
      .collection("users")
      .findOne(
        { _id: new ObjectId(mongoId) },
        { projection: { password: 0, address: 0, phoneNumber: 0 } }
      );

    if (!user) {
      throw { name: "NotFound" };
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await getDb().collection("users").findOne({ email });

    if (!user) {
      throw { name: "InvalidUserPassword" };
    }

    const passwordTrue = await bcrypt.compare(password, user.password);

    if (!passwordTrue) {
      throw { name: "InvalidUserPassword" };
    }

    const accessToken = signToken(user);
    res.send(200).json({
      access_token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { mongoId } = req.params;

    await getDb()
      .collection("users")
      .deleteOne({ _id: new ObjectId(mongoId) });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  readUser,
  login,
  deleteUser,
};
