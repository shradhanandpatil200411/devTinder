const express = require("express");
const { userAuth } = require("../Middleware/userAuth");
const ConnectionRequest = require("../Model/connectionRequestSchema");
const User = require("../Model/userSchema");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age photoUrl about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loginUser = req.user;

    const getAllRequest = await ConnectionRequest.find({
      toUserId: loginUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    if (getAllRequest.length == 0) {
      return res.status(400).json({ message: "No request found" });
    }
    res.json({ message: "Data fetch successfully", data: getAllRequest });
  } catch (err) {
    res.status(400).json({ message: "ERROR :" + err.message });
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const getConnectionData = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = getConnectionData.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    if (data.length == 0) {
      return res.status(404).json({ error: "no connection found" });
    }

    res.json({ data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 0;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const getAllConnectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromLoggedInUser = new Set();

    getAllConnectionRequest.forEach((user) => {
      hideUserFromLoggedInUser.add(user.fromUserId.toString());
      hideUserFromLoggedInUser.add(user.toUserId.toString());
    });

    const feedData = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromLoggedInUser) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: feedData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = userRouter;
