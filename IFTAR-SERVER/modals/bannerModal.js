const mongoose = require("mongoose");

const bannerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    productId: String,
    content: String,
    count: {
      type: Number,
      default: 0,
    },
    userDetails: {
      userId: String,
      phoneNumber: String,
      userName: String,
      refDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("banner", bannerSchema);
