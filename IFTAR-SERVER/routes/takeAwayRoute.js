const express = require("express");
const router = express.Router();
const {
  createTakeAwayOrder,
  getTakeAwayOrder,
  updateTakeAwayOrder,
  addTakeAwayOrder
} = require("../controllers/takeAwayController");
const { webTokenMiddleware } = require("../middleWare/webMiddleware");

router
  .post("/createtakeaway", createTakeAwayOrder)
  .get("/gettakeaway", getTakeAwayOrder)
  .put("/updatetakeaway/:id", updateTakeAwayOrder);

// web
router.post("/add_takeaway_order",webTokenMiddleware,addTakeAwayOrder)


module.exports = router;
