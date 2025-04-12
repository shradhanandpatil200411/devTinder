const validator = require("validator");

const validateUser = (req) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email)) {
    throw new Error("Email id is not validated");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "email",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

const validatedPassword = (req) => {
  const newPasswordFromUser = req.body.newPassword;
  if (!validator.isStrongPassword(newPasswordFromUser)) {
    throw new Error("Please enter a strong password");
  }
};
module.exports = { validateUser, validateEditProfileData, validatedPassword };
