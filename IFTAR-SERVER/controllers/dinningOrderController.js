const dinning = require("../modals/dinningOrder");
const Cart = require("../modals/cart.models");
const Booking = require("../modals/tableBookingModal");
const Tables = require("../modals/table");
const _ = require("lodash");

const createDinningOrder = async (req, res) => {
  try {
    const result = await dinning.create({ ...req.body });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while creating dinning order");
  }
};

const getDinningOrder = async (req, res) => {
  try {
    const result = await dinning.find({}).sort({ createdAt: -1 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while fetching dinning order");
  }
};

const updateDinningOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dinning.findByIdAndUpdate(id, { ...req.body });
    return res.status(200).send({ data: result });
  } catch (e) {
    return res
      .status(500)
      .send("Something went wrong while updating dinning order");
  }
};

const addDiningOrder = async (req, res) => {
  try {
    let formData = {
      customerName: _.get(req, "body.customerName", ""),
      mobileNumber: _.get(req, "body.mobileNumber", ""),
      billAmount: _.get(req, "body.billAmount", ""),
      gst: _.get(req, "body.gst", ""),
      item_price: _.get(req, "body.item_price", ""),
      userId: _.get(req, "body.userDetails._id", ""),
      orderedFood: _.get(req, "body.orderedFood", ""),
      orderId: _.get(req, "body.orderId", ""),
      bookingId: _.get(req, "body.bookingId", ""),
      tableNo: _.get(req, "body.tableNo", ""),
      timeSlot: _.get(req, "body.timeSlot", ""),
    };
    await dinning.create(formData);
    let where = { bookingRef: _.get(req, "body.bookingId", "") };
    await Cart.deleteMany(where);
    return res.status(200).send({ message: "successs" });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while creating dinning order");
  }
};

const getDiningOrder = async (req, res) => {
  try {
    const result = await dinning
      .find({
        userId: _.get(req, "body.userDetails._id", ""),
      })
      .sort({ createdAt: -1 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while fetching dinning order");
  }
};

const getFilteredDiningOrders = async (req, res) => {
  try {
    const result = await dinning.find({
      bookingId: _.get(req, "params.id", ""),
    });
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send("Something went wrong while fetching dinning order");
  }
};

const updateBoockings = async (req, res) => {
  try {
    let where = { bookingRef: _.get(req, "body.booking_id", "") };
    await Cart.deleteMany(where);
    await Booking.findByIdAndUpdate(
      { _id: _.get(req, "body.booking_id", "") },
      { booking: "Checkout" }
    );
    await Tables.findByIdAndUpdate(
      { _id: _.get(req, "body.table_id", "") },
      { status: false }
    );
    return res.status(200).send("success");
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while fetching dinning order");
  }
};

module.exports = {
  createDinningOrder,
  getDinningOrder,
  updateDinningOrder,
  addDiningOrder,
  getDiningOrder,
  getFilteredDiningOrders,
  updateBoockings,
};
