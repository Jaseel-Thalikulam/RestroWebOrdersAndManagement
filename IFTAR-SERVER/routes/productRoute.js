const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  getProductDetails,
  addToCartFromProductDetails,
} = require("../controllers/productController");
const upload = require("../helper/upload");
const { webTokenMiddleware } = require("../middleWare/webMiddleware");
router
  .post("/createproduct", upload.single("file"), createProduct)
  .get("/getproduct", getProduct)
  .put("/updateproduct/:id", upload.single("file"), updateProduct)
  .delete("/deleteproduct/:id", deleteProduct);

// Web
router.get("/get_product_details/:id", getProductDetails);
router.post(
  "/addtocart_fromproduct_deatils",
  webTokenMiddleware,
  addToCartFromProductDetails
);
module.exports = router;
