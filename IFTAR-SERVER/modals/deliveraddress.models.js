const mongoose = require("mongoose");

const deliveryAddressSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    streetName: {
      type: String,
    },
    addressType:{
      type:String,
    },
    landMark: {
      type: String,
    },
    city: {
      type: String,
    },
    picCode: {
      type: String,
    },
    customerState: {
      type: String,
    },
    userId: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("delivery_address", deliveryAddressSchema);
