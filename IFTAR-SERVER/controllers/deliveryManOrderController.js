const delivery = require("../modals/deliveryManOrders");

const createDelivery = async (req, res) => {
  try {
    const result = await delivery.create({ ...req.body });
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
  }
};
const getDelivery = async (req, res) => {
  try {
    const result = await delivery.find({ });
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
  }
};


module.exports={createDelivery,getDelivery}
