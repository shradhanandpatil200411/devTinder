const express = require("express");
const connectDB = require("./Config/dataBase");
const app = express();
const cookiesParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173/",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookiesParser());

const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const requestRouter = require("./Routes/request");
const userRouter = require("./Routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    app.listen(3000, "0.0.0.0", () => {
      console.log("Server Start on port 3000");
    });
  })
  .catch(() => {
    console.error("Server is not responding");
  });
