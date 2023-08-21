module.exports = (err, req, res, next) => {
  let message = "Internal Server Error";
  let code = 500;
  console.log("ke error");
  console.log(err);

  switch (err.name) {
    case value:
      break;
    default:
      break;
  }

  res.status(code).json({
    message: message,
  });
};
