const Status = require("../modals/deliveryManOrderStatus");

const createDeliveryManStatus = async (req, res) => {
  try {
    const result = await Status.create({ ...req.body });
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
  }
};

const getDeliveryManStatus = async (req, res) => {
  try {
    const result = await Status.find({ });
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createDeliveryManStatus, getDeliveryManStatus };
