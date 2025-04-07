const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../Middleware/userAuth");

// get profile data

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const getUser = req.user;
    res.send(getUser);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = profileRouter;
