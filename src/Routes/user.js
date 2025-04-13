const express = require("express");
const { userAuth } = require("../Middleware/userAuth");
const ConnectionRequest = require("../Model/connectionRequestSchema");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loginUser = req.user;

    const getAllRequest = await ConnectionRequest.find({
      toUserId: loginUser._id,
      status: "interested",
    }).populate("toUserId", "firstName lastName age photoUrl about skills");

    if (getAllRequest.length == 0) {
      return res.status(400).json({ message: "No request found" });
    }
    res.json({ message: "Data fetch successfully", data: getAllRequest });
  } catch (err) {
    res.status(400).json({ message: "ERROR :" + err.message });
  }
});

module.exports = userRouter;
