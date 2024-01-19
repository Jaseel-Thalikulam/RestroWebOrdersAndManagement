const mongoose = require("mongoose");

const walletSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    tableNo: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    billDate: {
      type: String,
      required: true,
    },
    amountDeduction: {
      type: String,
      required: true,
    },
    totalBillAmount: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("wallet", walletSchema);
