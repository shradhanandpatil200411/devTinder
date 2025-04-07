const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../Middleware/userAuth");

// send connect request api

requestRouter.post("/sendConnectRequest", userAuth, (req, res) => {
  try {
    const getUser = req.user;
    res.send(getUser.firstName + " Sending the request");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = requestRouter;
