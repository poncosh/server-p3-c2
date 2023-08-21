if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = require("express")();
const { json, urlencoded } = require("express");
const cors = require("cors");
const port = 4000;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(require("./routes"));

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
