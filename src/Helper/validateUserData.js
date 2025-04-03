const validator = require("validator");

const validateUser = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!validator.isEmail(email)) {
    throw new Error("Email id is not validated");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

module.exports = validateUser;
