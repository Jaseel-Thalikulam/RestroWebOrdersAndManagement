const mongoose = require("mongoose");

const dinningOrderSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    tableNo: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
    },
    stopTime: {
      type: String,
    },
    timePicked: {
      type: String,
    },
    orderedFood: {
      type: Array,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    billAmount: {
      type: String,
      required: true,
    },
    billAmount: Number,
    gst: Number,
    item_price: Number,
    status: {
      type: String,
      default: "Order placed",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("dinningorder", dinningOrderSchema);
