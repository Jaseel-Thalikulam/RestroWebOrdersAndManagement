const express = require("express");
const router = express.Router();
const {
  createVideo,
  getVideo,
  updateVideo,
  deleteVideo,
} = require("../controllers/videoController");
const uploaders = require('../utils/uploaders')

const {VideoUploader} = uploaders

router
  .post("/createvideo",VideoUploader.single("file"),createVideo)
  .get("/getvideo", getVideo)
  .put("/updatevideo/:id",VideoUploader.single("file"), updateVideo)
  .delete("/deletevideo/:id", deleteVideo);

module.exports = router;
