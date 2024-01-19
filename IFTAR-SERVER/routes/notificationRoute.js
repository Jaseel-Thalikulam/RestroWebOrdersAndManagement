const express = require("express");
const router = express.Router();
const {
  createNotifications,getNotifications
} = require("../controllers/notificationcontroler");

router
  .post("/createnotification", createNotifications)
  .get("/getnotification", getNotifications)


module.exports = router;
