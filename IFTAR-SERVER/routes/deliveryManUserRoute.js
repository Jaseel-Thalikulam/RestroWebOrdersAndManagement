const express = require("express");
const router = express.Router();
const {
  createDeliveryUser,
  getDeliveryUser,
  updateDeliveryUser,
} = require("../controllers/deliveryManUserController");

router
  .post("/create_delivery_user", createDeliveryUser)
  .get("/get_delivery_user", getDeliveryUser)
  .put("/update_delivery_user/:id", updateDeliveryUser);

module.exports = router;
