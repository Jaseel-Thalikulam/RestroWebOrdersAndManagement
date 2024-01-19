const express = require("express");
const router = express.Router();
const {
  createScratch,
  getScratch,
  checkScrachCardDetails,
  checkMyContestDetails
} = require("../controllers/scratchController");
const { webTokenMiddleware } = require("../middleWare/webMiddleware");

router.post("/createscratch", createScratch).get("/getscratch", getScratch);

// web
router.post("/check_scrach_details", webTokenMiddleware, checkScrachCardDetails);
router.get("/check_my_contest_details", webTokenMiddleware, checkMyContestDetails);

module.exports = router;
