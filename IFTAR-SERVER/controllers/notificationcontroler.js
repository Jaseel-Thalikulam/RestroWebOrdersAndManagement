const notification = require("../modals/notification.model");

const createNotifications = async (req, res) => {
  try {
    const result = await notification.create({ ...req.body });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send("Something went wrong while creating notificatio");
  }
};

const getNotifications = async (req, res) => {
  try {
    const result = await notification.find({}).sort({ createdAt: -1 });
    return res.status(200).send({ data: result });
  } catch (e) {
    return res
      .status(500)
      .send("Something went wrong while fetching notificatio");
  }
};

module.exports = { createNotifications, getNotifications };
