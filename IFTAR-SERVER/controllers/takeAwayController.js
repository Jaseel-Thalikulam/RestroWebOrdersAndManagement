const takeAway = require("../modals/takeAwayModal");
const Cart = require("../modals/cart.models");
const _ = require("lodash");
const User = require("../modals/userModal");
const createTakeAwayOrder = async (req, res) => {
  try {
    const result = await takeAway.create({ ...req.body });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while creating takeAway order");
  }
};

const getTakeAwayOrder = async (req, res) => {
  try {
    const result = await takeAway.find({}).sort({ createdAt: -1 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while fetching takeAway order");
  }
};

const updateTakeAwayOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await takeAway.findByIdAndUpdate(id, { ...req.body });
    return res.status(200).send({ data: result });
  } catch (e) {
    return res
      .status(500)
      .send("Something went wrong while updating takeAway order");
  }
};

const addTakeAwayOrder = async (req, res) => {
  try {
    console.log(req.body);
    const phoneNumber = req.body.userDetails.phoneNumber
    const user = await User.findOne({ phoneNumber }).select('userID');
    let formData = {
      customerName: _.get(req, "body.userDetails.user", ""),
      mobileNumber: _.get(req, "body.userDetails.phoneNumber", ""),
      billAmount: _.get(req, "body.billAmount", ""),
      gst: _.get(req, "body.gst", ""),
      delivery_charge: _.get(req, "body.delivery_charge", ""),
      packing_charge: _.get(req, "body.packing_charge", ""),
      transaction_charge: _.get(req, "body.transaction_charge", ""),
      coupon_amount: _.get(req, "body.coupon_amount", ""),
      item_price: _.get(req, "body.item_price", ""),
      userId: _.get(req, "body.userDetails._id", ""),
      BromagUserID:user.userID?user.userID:null,
      orderedFood: _.get(req, "body.orderedFood", ""),
      orderId: _.get(req, "body.orderId", ""),
      instructionsTakeaway: _.get(req, "body.instructionsTakeaway", ""),
    };
    const result = await takeAway.create(formData);
    let where = {
      userRef: _.get(req, "body.userDetails._id", ""),
      orderRef: "takeaway_order",
    };
    await Cart.deleteMany(where);
    return res.status(200).send({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

module.exports = {
  createTakeAwayOrder,
  getTakeAwayOrder,
  updateTakeAwayOrder,
  addTakeAwayOrder,
};
