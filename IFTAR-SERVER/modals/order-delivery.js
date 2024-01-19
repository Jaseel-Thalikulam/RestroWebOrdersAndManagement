const mongoose = require("mongoose");

const OrderDeliverySchema = mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
      required: true,
    },
    onlineOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "onlineorder",
    },
    callOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "callOrder",
    },
    startedAt: Date,
    startLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
    cancelledAt: Date,
    cancellationReason: String,
    reachedRestaurantAt: Date,
    restaurantSelfie: String,
    leftRestaurantAt: Date,
    deliveredAt: Date,
    deliveredLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
  },
  { timestamps: true, versionKey: false }
);

const OrderDelivery = mongoose.model(
  "OrderDelivery",
  OrderDeliverySchema,
  "order-deliveries"
);

module.exports = OrderDelivery;
