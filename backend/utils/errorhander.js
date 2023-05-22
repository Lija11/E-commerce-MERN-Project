// class ErrorHandler extends Error {
//   constructor(message, statusCode) {
//     super(message);
//     this.statusCode = statusCode;

//     Error.captureStackTrace(this, this.constructor);
//   }
// }

const ErrorHandler = (
  res,
  statusCode = 500,
  message = "Internal Server Error"
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = ErrorHandler;
