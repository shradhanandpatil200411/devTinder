const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../Middleware/userAuth");
const connectionRequest = require("../Model/connectionRequestSchema");
const User = require("../Model/userSchema");

// send connect request api

requestRouter.post("/request/:status/:userId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;

    const isAllowedStatus = ["interested", "ignored"];

    if (!isAllowedStatus.includes(status)) {
      throw new Error("Invalid status ");
    }

    const isUserIdValid = await User.findById(toUserId);

    if (!isUserIdValid) {
      throw new Error("Invalid user id");
    }

    const isConnectionRequestValid = await connectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (isConnectionRequestValid) {
      throw new Error("request send already");
    }

    const request = new connectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await request.save();
    res.json({
      message:
        req.user.firstName +
        " is " +
        status +
        (status == " interested " ? "in " : " to ") +
        isUserIdValid.firstName,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = requestRouter;
