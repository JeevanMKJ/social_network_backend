const { Schema, model, Types } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: "Username is mandatory",
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: "Email is mandatory",
      match: [
        /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)*(\.[a-zA-Z]{2,})$/,
        "Enter a valid email address",
      ],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

UserSchema.virtual("totalFriends").get(function () {
  return this.friends.length;
});

const User = model("User", UserSchema);

module.exports = User;
