// mongodb+srv://shradhanand:BZX8E6V7566UUUHu@studymongodb.fovl7.mongodb.net/DevTinder

const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("DataBase is Connect");
  await mongoose.connect(
    "mongodb+srv://shradhanand:6wy067GnZH2KnGbF@studymongodb.fovl7.mongodb.net/DevTinder"
  );
};

module.exports = connectDB;
