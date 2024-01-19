const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    alter_mobile_number: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    status: {
      type: String,
    },
    otp: {
      code: {
        type: String,
        default: null,
      },
      expiry: {
        type: Date,
        default: null,
      },
    },
    tokenRef: String,
    user_image: {
      type: String,
      default: null,
    },
    user_image_key: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
