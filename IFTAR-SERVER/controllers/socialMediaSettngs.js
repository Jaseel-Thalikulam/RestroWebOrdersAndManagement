const social = require("../modals/socialMediaFooter");
const helpers = require("../utils/helpers");
const { get } = require("lodash");

const createSocialMedia = async (req, res) => {
  try {
    const socialMedia = req.file;

    if (socialMedia) {
      const path = `SocialMedia/${get(req, "body.name")}${Date.now()}/${
        socialMedia.filename
      }`;
      await helpers.uploadFile(socialMedia, path);
      if (path) {
        await helpers.deleteS3File(path);
      }
      const image = helpers.getS3FileUrl(path);
      helpers.deleteFile(socialMedia);
      await social.create({
        name: get(req, "body.name"),
        status: get(req, "body.status"),
        link: get(req, "body.link"),
        image: image,
      });

      return res.status(200).send({ message: "Social media  created successfully" });
    }
  } catch (err) {
    console.log(err);
  }
};

const getSocialMedia = async (req, res) => {
  try {
    const result = await social.find({});
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
  }
};

const updateSocialMedia = async (req, res) => {
  const {id}=req.params
  try{
    const imageUrl=req.body.image
   
    if (get(req, "file", false)) {
      const socialMedia = req.file;
     
      if (socialMedia) {
        const path = `SocialMedia/${get(req, "body.name")}${Date.now()}/${
          socialMedia.filename
        }`;
        await helpers.uploadFile(socialMedia, path);
        if (imageUrl) {
          await helpers.deleteS3File(imageUrl);
        }
        const image = helpers.getS3FileUrl(path);
        helpers.deleteFile(socialMedia);
        await social.findByIdAndUpdate(id,{
          name: get(req, "body.name"),
          status: get(req, "body.status"),
          link: get(req, "body.link"),
          image: image,
        });
  
       
        return res.status(200).send({ message: "Social media updated successfully" });
      }
    } else {
   
      await social.findByIdAndUpdate(id, {
        name: get(req, "body.name"),
          status: get(req, "body.status"),
          link: get(req, "body.link"),
        image: get(req, "body.image", ""),
      });
      return res.status(200).send({ Message: "Social media  updated successfully" });
    }
  }catch(err){
    
  }
};

const deleteSocialMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;
    await social.findByIdAndDelete(id);
    await helpers.deleteS3File(image);
    return res.status(200).send("Social media  deleted");
  } catch (e) {
    return res.status(500).send("Something went wrong while deleting category");
  }
};

module.exports = {
  createSocialMedia,
  getSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
};
