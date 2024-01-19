const _ = require("lodash");
const mongoose = require("mongoose")
const OnlineOrder = require("../modals/onlineOrderModal");
const TakeAway = require("../modals/takeAwayModal");
const DeliveryAddress = require("../modals/deliveraddress.models");
const TableBooking = require("../modals/tableBookingModal");
const Order = require("../modals/order");

const getMyOnlineOrder = async (req, res) => {
  try {

    console.log("calll",req.body.userDetails);
    // const result = await OnlineOrder.find({
    //   userId: new mongoose.Types.ObjectId(req.body.userDetails._id),
    // }).sort({ createdAt: -1 });

      const result = await Order.find({
      orderType: "online",
      user: new mongoose.Types.ObjectId(req.body.userDetails._id)
    }).sort({
      createdAt: -1,
    });

    console.log(result, "ress");
    
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getMyTakeAwayOrder = async (req, res) => {
  try {
    const result = await TakeAway.find({
      userId: _.get(req, "body.userDetails._id", ""),
    }).sort({ createdAt: -1 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getMyDeliveryAddress = async (req, res) => {
  try {
    const result = await DeliveryAddress.find({
      userId: _.get(req, "body.userDetails._id", ""),
    }).sort({ createdAt: -1 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getMyProfileDining = async (req, res) => {
  try {
    const result = await TableBooking.find({
      userId: _.get(req, "body.userDetails._id", ""),
    }).sort({ createdAt: -1 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = {
  getMyOnlineOrder,
  getMyTakeAwayOrder,
  getMyDeliveryAddress,
  getMyProfileDining,
};
