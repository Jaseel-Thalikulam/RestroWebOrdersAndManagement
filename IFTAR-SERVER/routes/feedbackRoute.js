const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getFeedback,
  updateFeedback,
  addMyfeedback,
  getMyfeedback,
  getAllfeedback,
  deleteMyFeedBack,
} = require("../controllers/feedbackController");
const { webTokenMiddleware } = require("../middleWare/webMiddleware");

router
  .post("/createfeedback", createFeedback)
  .get("/getfeedback", getFeedback)
  .put("/updatefeedback/:id", updateFeedback);

// Web
router.post("/add_my_feedback", webTokenMiddleware, addMyfeedback);
router.post("/get_my_feedback", webTokenMiddleware, getMyfeedback);
router.get("/get_all_feedback", getAllfeedback);
router.delete("/delete_my_feedback/:id", deleteMyFeedBack);

module.exports = router;
