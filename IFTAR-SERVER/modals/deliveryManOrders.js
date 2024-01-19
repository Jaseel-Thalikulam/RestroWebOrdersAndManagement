const mongoose = require("mongoose");

const deliveryManOrdersSchema = mongoose.Schema(
  {
    // orderId: {
    //   type: String,
    //   required: true,
    // },
    location: {
      type: Array,
      required: true,
    },
    hotelContactNumber: {
      type: Number,
      required: true,
    },
    PickupLocation: {
      type: String,
      required: true,
    },
    foods: {
      type: Array,
      required: true,
    },
    billAmount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("deliveryManOrders", deliveryManOrdersSchema);
