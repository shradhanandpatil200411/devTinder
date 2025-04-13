const express = require("express");
const User = require("../Model/userSchema");
const bcrypt = require("bcrypt");
const { validateUser } = require("../Helper/validateUserData");
const authRouter = express.Router();

// Signup api add new user

authRouter.post("/signup", async (req, res) => {
  try {
    // validated the user Data use helper create a helper function
    validateUser(req);

    const { firstName, lastName, email, password, about, skills, age } =
      req.body;
    // Create password hash
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      about,
      skills,
      age,
    });

    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

// Post login API

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid login user");
    }

    const isPasswordValid = await user.passwordValidation(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 3600000),
      });

      res.send("Login Successfully");
    } else {
      throw new Error(" Invalid login user");
    }
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

// post Logout api

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successfully");
});

module.exports = authRouter;
