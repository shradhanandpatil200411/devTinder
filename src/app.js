const express = require("express");
const connectDB = require("./Config/dataBase");
const app = express();
const User = require("./Model/userSchema");
const validateUser = require("./Helper/validateUserData");
const bcrypt = require("bcrypt");

app.use(express.json());

// Signup api add new user
app.post("/signup", async (req, res) => {
  try {
    // validated the user Data use helper create a helper function
    validateUser(req);

    const { firstName, lastName, email, password, about, skills, age } =
      req.body;
    // Create password hash
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

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

// get all user data api

app.get("/feed", async (req, res) => {
  try {
    const getAllUser = await User.find({});
    if (getAllUser.length === 0) {
      res.status(404).send("Data Not Found");
    } else {
      res.send(getAllUser);
    }
  } catch (err) {
    res.status(404).send("Data Not Found");
  }
});

// get data by email id

app.get("/userByEmail", async (req, res) => {
  try {
    const getData = await User.findOne({ email: req.body.email });
    if (!getData) {
      res.status(404).send("Data Not Found");
    } else {
      res.send(getData);
    }
  } catch (err) {
    res.status(404).send("Data Not Found");
  }
});

// get data use a id

app.get("/userById", async (req, res) => {
  try {
    const getData = await User.findById({ _id: req.body._id });
    if (!getData) {
      res.status(404).send("Data Not Found 1");
    } else {
      res.send(getData);
    }
  } catch (err) {
    res.status(404).send("Data Not Found");
  }
});

// create a Deleted use api

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (err) {
    res.send("Something  wrong ");
  }
});

// update the user by id

app.patch("/user", async (req, res) => {
  try {
    const ALLOWUPDATE = ["age", "gender", "skills", "photoUrl"];

    const userId = req.body.userId;
    const userData = req.body;
    const isUpdate = Object.keys(userData).every((k) => {
      ALLOWUPDATE.includes(k);
    });

    if (isUpdate) {
      throw new Error("update is not allowed ");
    }
    const user = await User.findByIdAndUpdate(userId, userData, {
      returnDocument: "after",
    });
    res.send(user);
  } catch (err) {
    res.send("something wrong :" + err.message);
  }
});

// update user by email id use findOne

app.patch("/userEmail", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const userData = req.body;

    console.log(userEmail, userData);

    const user = await User.findOneAndUpdate({ email: userEmail }, userData, {
      returnDocument: "after",
    });
    res.send(user);
  } catch (err) {
    res.status(404).send("something wrong");
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
