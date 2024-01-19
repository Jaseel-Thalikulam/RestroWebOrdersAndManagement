const express = require("express");
const router = express.Router();
const {
createWalletBalance,getWalletBalance,updateWalletBalance
} = require("../controllers/walletBalanceController");

router
  .post("/createwalletbalance", createWalletBalance)
  .get("/getwalletbalance", getWalletBalance)
  .put("/updatewalletbalance/:id", updateWalletBalance)
  

module.exports = router;
