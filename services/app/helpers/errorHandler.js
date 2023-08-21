const { ValidationError } = require("sequelize");

module.exports = (err, req, res, next) => {
  let message = "Internal server error";
  let code = 500;

  if (err instanceof ValidationError) {
    message = err.errors.map((el) => el.message);
    code = 400;
  }
  switch (err.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      message = err.errors.map((el) => el.message);
      code = 400;
      break;
    case "InvalidEmail":
    case "InvalidPassword":
      message = "Invalid email/password";
      code = 400;
    case "ExistedData":
    case "InvalidPost":
      message = "Existed data, unauthorized to create more";
      code = 401;
    case "Unauthorized":
      message = "Token seems not match";
      code = 401;
    case "InvalidEdit":
      message = "Unauthorized to add tags more than 3";
      code = 401;
    case "NoToken":
      message = "Not found any token on your header";
      code = 403;
    case "Forbidden":
      message = "You are not allowed to do that";
      code = 403;
    case "NotFound":
      message = "Data not found";
      code = 404;
    default:
      break;
  }

  res.status(code).json({
    message,
  });
};
