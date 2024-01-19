const _ = require("lodash");
const User = require("../modals/userModal");
const {
    uploadToCloud,
    deleteFileInLocal,
    deleteFileInCloud,
    getUrl,
} = require("../helper/uploadToS3");

const updateProfile = async (req, res) => {
    try {
        const result = await uploadToCloud(req, 1, "Profile");
        deleteFileInLocal(req);
        let url = getUrl(result);
        await User.findByIdAndUpdate(
            { _id: _.get(req, "body.userDetails._id", "") },
            { user_image: url, user_image_key: result }
        );
        deleteFileInCloud(_.get(req, "body.user_image_key", ""));
        return res.status(200).send({ url: result });
    } catch (err) {
        return res
            .status(500)
            .send({ message: "failed to update user profile" });
    }
};

module.exports = { updateProfile };
