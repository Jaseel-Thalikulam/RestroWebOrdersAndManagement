const express = require("express");
const router = express.Router();

const {
  createDeliveryManProfile,
  getDeliveryManProfile,
} = require("../controllers/delliveryManProfile.controller");

router
  .post("/create_delivery_man_profile", createDeliveryManProfile)
  .get("/get_delivery_man_profile", getDeliveryManProfile);

module.exports = router;
