const { getDateAfterDays } = require("../helper/date_helper");
const Scratch = require("../modals/scratchCard.modal");
const _ = require("lodash");

const createScratch = async (req, res) => {
  try {
    const { number } = req.body;
    const isNumber = await Scratch.find({ number });

    if (isNumber.length !== 0) {
      return res.status(404).send({ data: "This number already exists..." });
    } else {
      const result = await Scratch.create({ ...req.body });
      return res.status(200).send({ data: result });
    }
  } catch (err) {
    return res.status(500).send("Something went wrong while creating video");
  }
};

const getScratch = async (req, res) => {
  try {
    const { search } = req.query;
    if (search === "all") {
      const result = await Scratch.find({}).sort({ createdAt: -1 });
      return res.status(200).send({ data: result });
    } else if (search === "expired" || search === "notexpired") {
      const result = await Scratch.find({
        expired: search === "expired" ? true : false,
      });
      return res.status(200).send({ data: result });
    } else if (search === "winner" || search === "notwinner") {
      const result = await Scratch.find({
        status: search === "winner" ? true : false,
      });
      return res.status(200).send({ data: result });
    }
  } catch (e) {
    return res.status(500).send("Something went wrong while fetching video");
  }
};

const checkScrachCardDetails = async (req, res) => {
  try {
    const validate = await Scratch.find({
      number: _.get(req, "body.card_number", ""),
    });

    if (_.isEmpty(validate)) {
      return res
        .status(500)
        .send({ messsage: "The Scratch number your entered is not valid." });
    }

    const orderIdFromBody = _.get(req, "body.order_id", "");
    const scratchOrderId = _.get(validate, "[0].order_id");

    if (scratchOrderId === orderIdFromBody) {
      return res
        .status(500)
        .send({ message: "The order id is not valid for this Scratch card." });
    }

    if (_.get(validate, "[0].expired", false)) {
      return res
        .status(500)
        .send({ messsage: "The scratch card has already been utilized." });
    }

    const ex_date = getDateAfterDays(30);
    let formdata = {
      order_id: _.get(req, "body.order_id", ""),
      contact_number: _.get(req, "body.contact_number", ""),
      userId: _.get(req, "body.userDetails._id", ""),
      expired: true,
      expireDate: ex_date,
    };

    await Scratch.findByIdAndUpdate(
      { _id: _.get(validate, "[0]._id", false) },
      formdata
    );
    let result = _.get(validate, "[0].status", false) ? "success" : "failed";
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send("Something went wrong");
  }
};

const checkMyContestDetails = async (req, res) => {
  try {
    const result = await Scratch.find({
      userId: _.get(req, "body.userDetails._id", ""),
      status: true,
    }).sort({ expireDate: -1 });
    return res.status(200).send({ data: result });
  } catch (e) {
    return res.status(500).send("Something went wrong ");
  }
};

module.exports = {
  createScratch,
  getScratch,
  checkScrachCardDetails,
  checkMyContestDetails,
};
