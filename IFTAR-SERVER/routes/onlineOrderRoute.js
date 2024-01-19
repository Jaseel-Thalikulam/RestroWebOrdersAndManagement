const express = require("express");
const router = express.Router();
const {
  createOnlineOrder,getOnlineOrder,updateOnlineOrder,deleteOnlineOrder,addOnlineOrder
} = require("../controllers/onlineOrderController");
const { webTokenMiddleware } = require("../middleWare/webMiddleware");

router
  .post("/createonlineOrder", createOnlineOrder)
  .get("/getonlineorder", getOnlineOrder)
  .put("/updateonlineorder/:id", updateOnlineOrder)
  .delete("/deleteonlineorder/:id", deleteOnlineOrder);

// Web
router.post("/add_online_order",webTokenMiddleware,addOnlineOrder)

module.exports = router;
