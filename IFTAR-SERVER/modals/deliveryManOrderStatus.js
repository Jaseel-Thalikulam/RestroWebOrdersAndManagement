const mongoose = require("mongoose");

const deliveryManOrderStatus = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    statusId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    billAmount:{
      type:Number,
      required:true,
    },
    order_status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "delivery_man_Order_status",
  deliveryManOrderStatus
);
