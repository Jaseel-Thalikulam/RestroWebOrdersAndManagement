const banner = require("../modals/bannerModal");
const _ = require("lodash");
const helpers = require("../utils/helpers");

const createbanner = async (req, res) => {
  try {
    const { name } = req.body;
    const bannerCount = await banner.countDocuments({ name });
    let maxBannerLimit = name.toLowerCase().includes("advertisement") ? 7 : 5;

    if (bannerCount >= maxBannerLimit) {
      return res
        .status(400)
        .send(
          `Your ${req.body.name} limit reached. Cannot create more banners.`
        );
    }

    const banners = req.files?.banner ?? [];

    if (banners.length > 0) {
      const uploadedImagePaths = [];

      for (const bannerFile of banners) {
        const imagePath = `${name}/${bannerFile.originalname}${Date.now()}/${bannerFile.filename}`;
        await helpers.uploadFile(bannerFile, imagePath);
        uploadedImagePaths.push(imagePath);
      }

      if (uploadedImagePaths) {
        uploadedImagePaths.map((path) => helpers.deleteS3File(path));
      }

      const bannerImages = uploadedImagePaths.map((path) =>
        helpers.getS3FileUrl(path)
      );

      banners.forEach((bannerFile) => {
        helpers.deleteFile(bannerFile);
      });

      await banner.create({
        name: _.get(req, "body.name"),
        productId: _.get(req, "body.productId", ""),
        content: _.get(req, "body.content", ""),
        image: bannerImages,
      });

      return res
        .status(200)
        .send({
          message: `${name} created successfully with ${banners.length} banners`,
        });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong while creating banner");
  }
};

const getbanner = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      const result = await banner.find({});
      return res.status(200).send({ data: result });
    } else {
      const result = await banner.find({ name: search });
      return res.status(200).send({ data: result });
    }
  } catch (e) {
    return res.status(500).send("Something went wrong while fetching banner");
  }
};

const updatebanner = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const banners = req.files?.banner ?? [];
    const { image } = req.body;
    if (banners.length > 0) {

      const uploadedImagePaths = [];

      for (const bannerFile of banners) {
        const imagePath = `${name}/${bannerFile.originalname}${Date.now()}/${bannerFile.filename}`;
        await helpers.uploadFile(bannerFile, imagePath);
        uploadedImagePaths.push(imagePath);
      }
      await helpers.deleteS3File(image);
      const bannerImages = uploadedImagePaths.map((path) =>
        helpers.getS3FileUrl(path)
      );

      banners.forEach((bannerFile) => {
        helpers.deleteFile(bannerFile);
      });

      const oldImages=req.body.image.split(",")
      oldImages.map(async (res) => {
        await helpers.deleteS3File(res);
      });  

      await banner.findByIdAndUpdate(id,{
        name: _.get(req, "body.name"),
        productId: _.get(req, "body.productId", ""),
        content: _.get(req, "body.content", ""),
        image:bannerImages,
      });

      return res
        .status(200)
        .send({
          message: `${name} updated successfully with ${banners.length} banners`,
        });
    }else{

      await banner.findByIdAndUpdate(id,{
        name: _.get(req, "body.name"),
        productId: _.get(req, "body.productId", ""),
        content: _.get(req, "body.content", ""),
        image:image.split(","),
      });
    }
    return res
        .status(200)
        .send({
          message: `Banner updated successfully`,
        });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Something went wrong while updating banner");
  }
};

const deletebanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;
  

    await banner.findByIdAndDelete(id);
    image.map(async (res) => {
      await helpers.deleteS3File(res);
    });

    return res.status(200).send("banner deleted");
  } catch (e) {
    return res.status(500).send("Something went wrong while deleting banner");
  }
};

const getSpecificBanner = async (req, res) => {
  try {
    let { id } = req.params;
    let uniqRef = id.split("_").join(" ");
    const result = await banner.find({ name: uniqRef });
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

const updateAdvertisementBanner = async (req, res) => {
  try {
    let { id } = req.body;
    let formData = {
      userId: _.get(req, "body.userDetails._id", ""),
      phoneNumber: _.get(req, "body.userDetails.phoneNumber", ""),
      userName: _.get(req, "body.userDetails.user", ""),
    };

    const result = await banner.findByIdAndUpdate(
      { _id: id },
      {
        $inc: { count: 1 },
        $push: {
          userDetails: formData,
        },
      }
    );
    return res.status(200).send({ data: result });
  } catch (e) {
    return res.status(500).send("Something went wrong ");
  }
};

module.exports = {
  createbanner,
  deletebanner,
  getbanner,
  updatebanner,
  getSpecificBanner,
  updateAdvertisementBanner,
};
