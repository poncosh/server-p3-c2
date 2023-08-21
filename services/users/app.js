if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = require("express")();
const { json, urlencoded } = require("express");
const cors = require("cors");
const { connect } = require("./config/connect");
const errorHandler = require("./helpers/errorHandler");
const port = 4002;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(require("./routes"));
app.use(errorHandler);

connect().then((success) => {
  app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
    console.log(success);
  });
});
