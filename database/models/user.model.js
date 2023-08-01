import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    userName: {
      type: String
    },
    FirstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String
    },
    cPassword: {
      type: String
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    phone: {
      type: String
    },
    isOnline: {
      type: String,
      default: "false",
    },
    isDeleted: {
      type: String,
      default: "false",
    },
  },
  { timestamps: true }
);


export const userModel = mongoose.model("user", userSchema);
