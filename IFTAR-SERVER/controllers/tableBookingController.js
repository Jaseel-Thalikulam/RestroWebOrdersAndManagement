const Table = require("../modals/table");
const tableBooking = require("../modals/tableBookingModal");
const _ = require("lodash");

const createTableBooking = async (req, res) => {
  try {
    const result = await tableBooking.create({ ...req.body });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while creating table booking");
  }
};

const getTableBooking = async (req, res) => {
  try {
    const result = await tableBooking.find({}).sort({ createdAt: -1 });
    return res.status(200).send({ data: result });
  } catch (e) {
    return res
      .status(500)
      .send("Something went wrong while fetching tableBooking");
  }
};

const updateTableBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await tableBooking.findByIdAndUpdate(id, { ...req.body });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while updating tableBooking");
  }
};

const bookMyTable = async (req, res) => {
  try {
    const formDatas = {
      customerName: _.get(req, "body.customerName", ""),
      contactNumber: _.get(req, "body.contactNumber", ""),
      alterateContactNumber: _.get(req, "body.alterateContactNumber", ""),
      pickupAddress: _.get(req, "body.pickupAddress", ""),
      location: _.get(req, "body.location", ""),
      pickupOption: _.get(req, "body.pickupOption", ""),
      noOfGuest: _.get(req, "body.noOfGuest", ""),
      timeSlot: _.get(req, "body.timeSlot", ""),
      booking: _.get(req, "body.booking", ""),
      tableNo: _.get(req, "body.tableNo", ""),
      tablePic: _.get(req, "body.tablePic", ""),
      tableId: _.get(req, "body.tableId", ""),
      userId: _.get(req, "body.userDetails._id", ""),
    };

    await tableBooking.create(formDatas);
    const result = await Table.findByIdAndUpdate(
      { _id: _.get(req, "body.tableId", "") },
      { status: true }
    );
    return res.status(200).send({
      message: "Your table reservation has been successfully confirmed.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

const getAllBookedTables = async (req, res) => {
  try {
    const result = await tableBooking.find({
      userId: _.get(req, "body.userDetails._id", ""),
      booking:{  $ne: "Canceled" },
    });
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

const cancelBooking = async (req, res) => {
  try {
    await tableBooking.findByIdAndUpdate(
      { _id: _.get(req, "body.booking_id", "") },
      { booking: "Canceled" }
    );
    await Table.findByIdAndUpdate(
      { _id: _.get(req, "body.table_id", "") },
      { status: false }
    );
    return res.status(200).send({ message: "Success" });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while updating tableBooking");
  }
};

const checkInBooking = async (req, res) => {
  try {
    await tableBooking.findByIdAndUpdate(
      { _id: _.get(req, "body.booking_id", "") },
      { booking: "CheckIn" }
    );
    return res.status(200).send({ message: "Success" });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while updating tableBooking");
  }
};

module.exports = {
  createTableBooking,
  getTableBooking,
  updateTableBooking,
  bookMyTable,
  getAllBookedTables,
  cancelBooking,
  checkInBooking,
};
