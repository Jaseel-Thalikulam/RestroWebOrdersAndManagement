const mongoose = require("mongoose");

const scratchSchema = mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    expired: {
      type: Boolean,
      default: false,
    },
    order_id: String,
    contact_number: Number,
    userId: String,
    expireDate:{
      type:Date,
      default:null
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("scratchCard", scratchSchema);
