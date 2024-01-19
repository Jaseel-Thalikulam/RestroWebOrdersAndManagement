const onlineOrder = require("../modals/onlineOrderModal");
const Cart = require("../modals/cart.models");
const _ = require("lodash");
const Order = require("../modals/order");
const User = require("../modals/userModal");
const createOnlineOrder = async (req, res) => {
  try {
    // const result = await Order.create({ ...req.body, orderType: "online" });
    // let where = {
    //   userRef: _.get(req, "body.userDetails._id", ""),
    //   orderRef: "online_order",
    // };
    // await Cart.deleteMany(where);
    // const riders = await DeliveryBoy.find();  rituraj updated code //--------
    // for(let rider of riders) {
    //   if(rider.fcmToken && rider.onDuty) {
    //     helpers.sendPushNotification(rider.fcmToken, 'New Order Created', 'A new order has been created', 'order-created', {order: result})
    //   }
    // }
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .send("Something went wrong while creating online order");
  }
};

const getOnlineOrder = async (req, res) => {
  try {
    const result = await Order.find({
      orderType: "online",
      
    }).sort({
      createdAt: -1,
    });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while fetching online order");
  }
};

const updateOnlineOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Order.findOneAndUpdate(
      { _id: id, orderType: "online" },
      { ...req.body }
    );
    return res.status(200).send({ data: result });
  } catch (e) {
    return res
      .status(500)
      .send("Something went wrong while updating online order");
  }
};

const deleteOnlineOrder = async (req, res) => {};

// Web
const addOnlineOrder = async (req, res) => {
  try {
    const phoneNumber = req.body.userDetails.phoneNumber
    const user = await User.findOne({ phoneNumber }).select('userID');
    let formData = {
      customerName: _.get(req, "body.customerName", ""),
      mobileNumber: _.get(req, "body.mobileNumber", ""),
      billAmount: _.get(req, "body.billAmount", ""),
      gst: _.get(req, "body.gst", ""),
      deliveryCharge: _.get(req, "body.deliveryCharge", ""),
      packingCharge: _.get(req, "body.packingCharge", ""),
      transactionCharge: _.get(req, "body.transactionCharge", ""),
      couponAmount: _.get(req, "body.couponAmount", ""),
      itemPrice: _.get(req, "body.itemPrice", ""),
      user: _.get(req, "body.userDetails._id", ""),
      orderedFood: _.get(req, "body.orderedFood", ""),
      location: _.get(req, "body.location", ""),
      instructions: req.body.instructions,
      types: req.body.types,
      BromagUserID:user.userID?user.userID:null,
      status: "placed",
      orderId: _.get(req, "body.orderId", ""),
      orderType: "online",
    };
    const result = await Order.create(formData);
    let where = {
      userRef: _.get(req, "body.userDetails._id", ""),
      orderRef: "online_order",
    };
    await Cart.deleteMany(where);
    console.log(result);
    return res.status(200).send({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

module.exports = {
  createOnlineOrder,
  getOnlineOrder,
  deleteOnlineOrder,
  updateOnlineOrder,
  addOnlineOrder,
};
