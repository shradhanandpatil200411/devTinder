const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../Middleware/userAuth");
const { validateEditProfileData } = require("../Helper/validateUserData");
const { validatedPassword } = require("../Helper/validateUserData");
const User = require("../Model/userSchema");
const bcrypt = require("bcrypt");

// get profile data

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const getUser = req.user;
    res.send(getUser);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid update request");
    }
    const loginUserData = req.user; // previews user data
    const updateLoginUserData = req.body; // user update to this data

    Object.keys(updateLoginUserData).forEach((key) => {
      loginUserData[key] = updateLoginUserData[key];
    });
    await loginUserData.save();
    res.json({
      massage: `${loginUserData.firstName} your profile is update successfully`,
      data: loginUserData,
    });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    validatedPassword(req);
    const logInUser = req.body;
    const { email, oldPassword, newPassword } = logInUser;

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).send("Invalid User");
    }
    const oldPasswordValid = await user.passwordValidation(oldPassword);

    if (!oldPasswordValid) {
      res.status(400).send("invalid Old Password");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    // const token = await user.getJWT();
    // res.cookie("token", null, { expires: new Date(Date.now()) });

    // res.cookie("token", token, {
    //   expires: new Date(Date.now() + 1 * 3600000),
    // });

    user.password = passwordHash;
    await user.save();
    res.send("Password change");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = profileRouter;
