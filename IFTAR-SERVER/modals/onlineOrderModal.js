const mongoose = require("mongoose");

const onlineOrderSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
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
    startTime: {
      type: String,
    },
    stopTime: {
      type: String,
    },
    timePicked: {
      type: String,
    },
    inventory: {
      type: Array,
    },
    location: {
      type: Array,
    },
    billAmount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Order placed",
      required: true,
    },
    instructions: {
      type: Array,
    },
    gst: {
      type: Number,
    },
    delivery_charge: {
      type: Number,
    },
    packing_charge: {
      type: Number,
    },
    transaction_charge: {
      type: Number,
    },
    coupon_amount: {
      type: Number,
    },
    orderId: {
      type: String,
      required: true,
    },
    item_price: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("onlineorder", onlineOrderSchema);
