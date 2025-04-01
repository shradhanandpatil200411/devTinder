const express = require("express");
const connectDB = require("./Config/dataBase");
const app = express();
const User = require("./Model/userSchema");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Shradhanand",
    lastName: "Patil",
    email: "Shradhanand@patil.gmail.com",
    password: "Shradhanand@123",
  });

  try {
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send("user is not save :" + err.message);
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
