const router = require("express").Router();
const { updateProfile } = require("../controllers/upload.controller");
const upload = require("../helper/upload");
const { webTokenMiddleware } = require("../middleWare/webMiddleware");

router.post(
  "/move_to_cloud",
  upload.single("file"),
  webTokenMiddleware,
  updateProfile
);

module.exports = router;
