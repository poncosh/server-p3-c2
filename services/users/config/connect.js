const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.DATABASE_MONGO_URI;
const dbName = process.env.DATABASE_MONGO_NAME;

console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let database;

const getDb = () => {
  return database;
};

const connect = async () => {
  try {
    await client.connect();
    const db = client.db(dbName);

    database = db;

    return "Successfully connected to MongoDB!";
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connect, getDb };
