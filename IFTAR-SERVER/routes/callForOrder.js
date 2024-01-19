const express = require("express");
const router = express.Router();
const {
  createCallOrder,
  getCallOrder,
  updateCallOrder,
  getMyCallForOrder,
  cancelMyCallOrder,
} = require("../controllers/callForOrderController");
const { webTokenMiddleware } = require("../middleWare/webMiddleware");

router
  .post("/createcallorder", createCallOrder)
  .get("/getcallorder", getCallOrder)
  .put("/updatecallorder/:id", updateCallOrder)

  .put("/cancel_my_call_order/:id", cancelMyCallOrder);

// web
router.get("/get_my_call_for_order", webTokenMiddleware, getMyCallForOrder);
module.exports = router;
