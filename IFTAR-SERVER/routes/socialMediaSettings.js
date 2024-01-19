const express = require("express");
const router = express.Router();
const {
  createSocialMedia,deleteSocialMedia,getSocialMedia,updateSocialMedia
} = require("../controllers/socialMediaSettngs");
const uploaders = require('../utils/uploaders')

const {ImageUploader} = uploaders

router
  .post(
    "/create_socialmedia",
    ImageUploader.single("file"),
    createSocialMedia
  )
  .get("/get_socialmedia", getSocialMedia)
  .put("/update_socialmedia/:id",ImageUploader.single("file"), updateSocialMedia)
  .delete("/delete_socialmedia/:id", deleteSocialMedia);


module.exports = router;
