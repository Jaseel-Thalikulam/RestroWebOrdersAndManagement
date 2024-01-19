const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getAllCusines,
  getAllCusinessFilter,
  getFilteredProducts,
  getAllSearchCusinessData,
  getAllvegData,
} = require("../controllers/categoryController");
const uploaders = require("../utils/uploaders");

const { ImageUploader } = uploaders;

router
  .post("/createcategory", ImageUploader.single("file"), createCategory)
  .get("/getcategory", getCategory)
  .put("/updatecategory/:id", ImageUploader.single("file"), updateCategory)
  .delete("/deletecategory/:id", deleteCategory);

// web
router.get("/get_all_cusiness_data/:id", getAllCusines);
router.get("/get_search_cusiness_data/:id", getAllSearchCusinessData);
router.get("/get_all_cusiness_filter/:id", getAllCusinessFilter);
router.get("/get_filtered_products/:id", getFilteredProducts);

module.exports = router;
