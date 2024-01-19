const status = require("../modals/RestaturantStatusModal");

const createStatus = async (req, res) => {
  try {
    const isStatus = await status.find({});
    if (isStatus.length === 0) {
      const result = await status.create({ ...req.body });
      return res.status(200).send({ message: result });
    } else {
      const result = await status.findByIdAndUpdate(isStatus[0]._id, {
        ...req.body,
      });
      return res.status(200).send({ message: result });
    }
  } catch (err) {
    console.log(err);
  }
};

const getStatus = async (req, res) => {
  try {
    const result = await status.find({});
    console.log(result);
    return res.status(200).send({ data: result });
  } catch (err) {}
};

module.exports = {
  createStatus,
  getStatus,
};
