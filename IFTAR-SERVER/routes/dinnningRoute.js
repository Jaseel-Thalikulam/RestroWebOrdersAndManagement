const express = require("express");
const router = express.Router();
const {
 createDinningOrder,getDinningOrder,updateDinningOrder,addDiningOrder,getDiningOrder,getFilteredDiningOrders,updateBoockings
} = require("../controllers/dinningOrderController");
const { webTokenMiddleware } = require("../middleWare/webMiddleware");

router
  .post("/createdinningorder", createDinningOrder)
  .get("/getdinningorder", getDinningOrder)
  .put("/updatedinningorder/:id", updateDinningOrder)
 
  // Web
  router.post("/add_dining_order", webTokenMiddleware,addDiningOrder);
  router.get("/get_dining_orders", webTokenMiddleware,getDiningOrder);
  router.get("/get_filtered_dining_orders/:id",getFilteredDiningOrders);
  router.put("/update_boockings",updateBoockings);

module.exports = router;
