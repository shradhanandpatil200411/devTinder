const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 2,
      maxLength: 15,
      require: true,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 15,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      minLength: 5,
      maxLength: 50,
      trim: true,
      unique: true,
      lowercase: true,
      validate: (value) => {
        const isValidEmail = validator.isEmail(value);
        if (!isValidEmail) {
          throw new Error(value.email + " This email id is not valid");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minLength: 8,
      maxLength: 500,
      validate: (value) => {
        const isValidPassword = validator.isStrongPassword(value);
        if (!isValidPassword) {
          throw new Error(value.password + " Set some strong password");
        }
      },
    },
    gender: {
      type: String,
      trim: true,
      require,
      maxLength: 8,
      lowercase: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://imgs.search.brave.com/WN4fV9d_eOtAjhegA4Zm8aDc477mMeIKoY7NtEBEuNo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vcGhvdG9z/L2ljb24tb2YtYS1i/dXNpbmVzc21hbi1h/dmF0YXItb3ItcHJv/ZmlsZS1waWMtcGlj/dHVyZS1pZDQ3NDAw/MTg5Mj9rPTIwJm09/NDc0MDAxODkyJnM9/NjEyeDYxMiZ3PTAm/aD1xbVAya2NWbENn/QVhvVVVyalROb0ln/Vm9qLVQ0d1RyTVhn/YVUwTkV5NFJnPQ",
      validate: (value) => {
        const isValidUrl = validator.isURL(value);
        if (!isValidUrl) {
          throw new Error(value.photoUrl + " Wrong Photo Url");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    about: {
      type: String,
      minLength: 5,
      maxLength: 200,
    },
    skills: [String],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "Shradhanand@PATIL2011", {
    expiresIn: "2d",
  });

  return token;
};

userSchema.methods.passwordValidation = async function (passwordInputUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(passwordInputUser, passwordHash);

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
