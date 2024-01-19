const mongoose = require("mongoose");

const tableBookingSchema = mongoose.Schema(
  {
    tableNo: {
      type: String,
      required: true,
    },
    tableId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    alterateContactNumber: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    pickupOption: {
      type: String,
      required: true,
    },
    noOfGuest: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    booking: {
      type: String,
    },
    tablePic: {
      type: String,
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("tableBooking", tableBookingSchema);
