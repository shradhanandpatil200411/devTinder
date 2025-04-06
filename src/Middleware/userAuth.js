const jwt = require("jsonwebtoken");
const User = require("../Model/userSchema");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Please Login Again");
    }
    const verifyToken = await jwt.verify(token, "Shradhanand@PATIL2011");

    if (!verifyToken) {
      throw new Error("Token expires");
    }
    const getUser = await User.findById(verifyToken._id);

    if (!getUser) {
      throw new Error("User Not Found");
    }
    req.user = getUser;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = { userAuth };
