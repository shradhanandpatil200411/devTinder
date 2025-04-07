const express = require("express");
const connectDB = require("./Config/dataBase");
const app = express();
const User = require("./Model/userSchema");
const validateUser = require("./Helper/validateUserData");
const bcrypt = require("bcrypt");
const cookiesParser = require("cookie-parser");
const { userAuth } = require("./Middleware/userAuth");

app.use(express.json());
app.use(cookiesParser());

// Signup api add new user

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

// get profile data

app.get("/profile", userAuth, async (req, res) => {
  try {
    const getUser = req.user;
    res.send(getUser);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

// send connect request api

app.post("/sendConnectRequest", userAuth, (req, res) => {
  try {
    const getUser = req.user;
    res.send(getUser.firstName + " Sending the request");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server Start Vicky");
    });
  })
  .catch(() => {
    console.error("Server is not responding");
  });
