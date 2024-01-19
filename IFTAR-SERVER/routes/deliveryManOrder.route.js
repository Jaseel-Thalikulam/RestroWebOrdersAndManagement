const express = require("express");
const router = express.Router();
const {
    createDelivery,
    getDelivery
} = require("../controllers/deliveryManOrderController");

router
  .post("/create_delivery", createDelivery)
  .get("/get_delivery", getDelivery)
  

module.exports = router;
