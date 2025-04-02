const express = require("express");
const connectDB = require("./Config/dataBase");
const app = express();
const User = require("./Model/userSchema");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send("user is not save :" + err.message);
  }
});

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

app.get("/findByEmail", async (req, res) => {
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

app.get("/findById", async (req, res) => {
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

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server Start Vicky");
    });
  })
  .catch(() => {
    console.error("Server is not responding");
  });
