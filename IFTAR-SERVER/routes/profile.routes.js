const express = require("express");
const router = express.Router();
const { getMyOnlineOrder,getMyTakeAwayOrder,getMyDeliveryAddress,getMyProfileDining } = require("../controllers/profile.controller");
const { webTokenMiddleware } = require("../middleWare/webMiddleware");

// Web
router.get("/get_my_online_order", webTokenMiddleware, getMyOnlineOrder);
router.get("/get_my_profile_takeaway_order", webTokenMiddleware, getMyTakeAwayOrder);
router.get("/get_my_profile_delivery_address", webTokenMiddleware, getMyDeliveryAddress);
router.get("/get_my_profile_dining_details", webTokenMiddleware, getMyProfileDining);

module.exports = router;
