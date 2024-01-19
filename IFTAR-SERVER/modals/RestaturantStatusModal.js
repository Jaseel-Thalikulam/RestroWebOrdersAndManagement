const mongoose = require("mongoose");

const restaurantStatusSchema = mongoose.Schema(
  {
    status: {
      type: Boolean,
      required: true,
    },
  },
  { timeStmaps: true }
);

module.exports = mongoose.model("restaturantStatus", restaurantStatusSchema);
