const mongoose = require("mongoose");

const typeSchema = mongoose.Schema({
  type: {
    type: String,
  },
  price: {
    type: Number,
  },
});

const OrderSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boy",
    },
    orderType: {
      type: String,
      enums: ["online", "call"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    orderedFood: {
      type: Array,
      required: true,
    },  
    types: [typeSchema],
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
    callForOrderInstrcution: {
      type: Array,
    },
    inventory: {
      type: Array,
    },
    // location: { rituraj updated code //--------
    //   type: {
    // 		type: String,
    // 		enum: ['Point'],
    // 	},
    // 	coordinates: {
    // 		type: [Number], // [longitude, latitude]
    // 	},
    // },
    location: {
      type: Array,
    },
    grandTotal: {
      type: String,
    },
    billAmount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enums: ["placed", "Order received"],
      required: true,
    },
    deliveryStatus: {
      type: String, // delivery, takeaway
      enums: ["delivery", "takeaway"],
    },
    gst: {
      type: Number,
    },
    deliveryCharge: {
      type: Number,
    },
    packingCharge: {
      type: Number,
    },
    transactionCharge: {
      type: Number,
    },
    instructions: {
      type: Array,
    },
    couponAmount: {
      type: Number,
    },
    itemPrice: {
      type: Number,
    },
    BromagUserID: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Order = mongoose.model("Order", OrderSchema, "orders");

module.exports = Order;
