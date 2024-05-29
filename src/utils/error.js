const CustomError = (message, code) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const NotFoundError = (message) => {
  return CustomError(message, 404);
};

const BadRequestError = (message) => {
  return CustomError(message, 400);
};

const UnauthorizedError = (message) => {
  return CustomError(message, 401);
};

const InternalServerError = (message) => {
  return CustomError(message, 500);
};

module.exports = {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  InternalServerError,
};
