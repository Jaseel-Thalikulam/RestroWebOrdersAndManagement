const express = require("express");
const router = express.Router();
const {
  createInventory,getInventory,deleteInventory,updateInventory
} = require("../controllers/inventoryController");
const uploaders = require('../utils/uploaders')

const {ImageUploader} = uploaders

router
  .post("/createinventory", ImageUploader.single("file"), createInventory)
  .get("/getinventory", getInventory)
  .put("/updateinventory/:id", ImageUploader.single("file"), updateInventory)
  .delete("/deleteinventory/:id", deleteInventory);

module.exports = router;
