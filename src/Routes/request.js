const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../Middleware/userAuth");
const ConnectionRequest = require("../Model/connectionRequestSchema");
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

    const isConnectionRequestValid = await ConnectionRequest.findOne({
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

    const request = new ConnectionRequest({
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
        (status == "interested" ? " in " : " to ") +
        isUserIdValid.firstName,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loginUser = req.user;
    const { status, requestId } = req.params;
    console.log(status);

    const isAllowedStatus = ["accepted", "rejected"];

    if (!isAllowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status " + status });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loginUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(400).json({ message: "connection request not found" });
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({
      message: "connection request " + status,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = requestRouter;
