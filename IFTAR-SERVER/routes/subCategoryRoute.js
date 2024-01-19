const express = require("express");
const router = express.Router();
const {
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategoryController");
const uploaders = require('../utils/uploaders')

const {ImageUploader} = uploaders

router
  .post("/createsubcategory", ImageUploader.single("file"), createSubCategory)
  .get("/getsubcategory", getSubCategory)
  .put("/updatesubcategory/:id",ImageUploader.single("file"), updateSubCategory)
  .delete("/deletesubcategory/:id", deleteSubCategory);

module.exports = router;
