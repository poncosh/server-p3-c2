if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = require("express")();
const { json, urlencoded } = require("express");
const cors = require("cors");
const errorHandler = require("./helpers/errorHandler");
const port = 4001;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/client", require("./routes/client"));
app.use("/admin", require("./routes/admin"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
