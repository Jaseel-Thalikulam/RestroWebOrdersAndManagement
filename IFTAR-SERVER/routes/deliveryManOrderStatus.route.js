const express = require("express");
const router = express.Router();
const {
 createDeliveryManStatus,getDeliveryManStatus
} = require("../controllers/deliveryManOrderStatus.controller");

router.post("/create_delivery_man_order_status", createDeliveryManStatus).get("/get_delivery_man_order_status", getDeliveryManStatus);

module.exports=router