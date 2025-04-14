const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "User",
    },
    status: {
      type: String,
      emit: ["interested", "ignored", "accepted", "rejected"],
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connection = this;

  if (connection.fromUserId.equals(connection.toUserId)) {
    throw new Error("You cannot send request to yourself");
  }

  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
