const express = require("express");
const router = express.Router();
const {
  createFooter,
  getFooter,
  updateFooter,
  deleteFooter,
} = require("../controllers/footer.controller");
const upload = require("../helper/upload");

router
  .post("/create_footer", upload.single("file"), createFooter)
  .get("/get_footer", getFooter);
// .put("/update_footer/:id",upload.single("file"), updateFooter).delete("/delete_footer/:id",deleteFooter);

module.exports = router;
