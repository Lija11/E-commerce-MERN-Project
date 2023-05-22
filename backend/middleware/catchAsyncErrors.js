// module.exports = (theFunc) => (req, res, next) => {
//   Promise.resolve(theFunc(req, res, next)).catch(next);
// };

const ErrorHandler = require("../utils/errorhander");

module.exports = (passedFunc) => (req, res, next) => {
  Promise.resolve(passedFunc(req, res, next)).catch((error) => {
    ErrorHandler(res, 500, error.message);
  });
};
