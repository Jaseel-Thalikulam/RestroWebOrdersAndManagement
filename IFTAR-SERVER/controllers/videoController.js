const video = require("../modals/videoModal");
const { get } = require("lodash");
const helpers = require("../utils/helpers");
const { v4: uuidv4 } = require("uuid");

const createVideo = async (req, res) => {
  try {
    const { name } = req.body;
    const videoCount = await video.countDocuments({ name });
    let maxVideoLimit = name.toLowerCase().includes("bromag") ? 2 : 3;

    if (videoCount >= maxVideoLimit) {
      return res
        .status(400)
        .send(`Your ${name} video limit reached. Cannot create more videos.`);
    }

    const videoFile = req.file;
    if (videoFile) {
      const path = `Videos/${videoFile.originalname}${Date.now()}/${
        videoFile.filename
      }`;
      await helpers.uploadFile(videoFile, path);
      if (path) {
        await helpers.deleteS3File(path);
      }
      const vdo = helpers.getS3FileUrl(path);
      helpers.deleteFile(videoFile);
      await video.create({
        name: req.body.name,
        video: vdo,
      });
      return res.status(200).send({ message: "Video created successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong while creating video");
  }
};
const getVideo = async (req, res) => {
  try {
    const result = await video.find({});
    return res.status(200).send({ data: result });
  } catch (e) {
    return res.status(500).send("Something went wrong while fetching video");
  }
};

const updateVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const videoUrl = req.body.video;
    if (get(req, "file", false)) {
      const videoFile = req.file;
      if (videoFile) {
        const path = `Videos/${videoFile.originalname}${Date.now()}/${
          videoFile.filename
        }`;
        await helpers.uploadFile(videoFile, path);
        if (videoUrl) {
          await helpers.deleteS3File(videoUrl);
        }
        const vdo = helpers.getS3FileUrl(path);
        helpers.deleteFile(videoFile);
        await video.findByIdAndUpdate(id, {
          name: req.body.name,
          video: vdo,
        });

        return res
          .status(200)
          .send({ message: "Cusines updated successfully" });
      }
    } else {
  
      await video.findByIdAndUpdate(id, {
        name: req.body.name,
        video: req.body.video_key,
      });
      return res.status(200).send({ Message: "created successfully" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send("Something went wrong while updating video");
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const videoUrl = req.body.video;
    await video.findByIdAndDelete(id);
    await helpers.deleteS3File(videoUrl);
    return res.status(200).send("Video deleted");
  } catch (e) {
    return res.status(500).send("Something went wrong while deleting video");
  }
};

module.exports = { createVideo, deleteVideo, getVideo, updateVideo };
