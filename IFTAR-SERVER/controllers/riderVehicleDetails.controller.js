const Details = require("../modals/riderVehicleDetails.modal");

const createVehicleDetails = async (req, res) => {
  try {
    const result = await Details.create({ ...req.body });
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
  }
};

const getVehicleDetails = async (req, res) => {
  try {
    const result = await Details.find({  });
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createVehicleDetails, getVehicleDetails };
