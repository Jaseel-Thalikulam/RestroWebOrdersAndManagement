const Delivery = require("../modals/deliveraddress.models");
const _ = require("lodash");

const addDeliveryAddress = async (req, res) => {
    try {
        let formData = {
            name: _.get(req, "body.name"),
            streetName: _.get(req, "body.streetName"),
            addressType:_.get(req,"body.addressType"),
            landMark: _.get(req, "body.landMark"),
            city: _.get(req, "body.city"),
            picCode: _.get(req, "body.picCode"),
            customerState: _.get(req, "body.customerState"),
            mobileNumber: _.get(req, "body.mobileNumber"),
            userId: _.get(req, "body.userDetails._id"),
        };
        await Delivery.create(formData);
        return res.status(200).send("The address has been added successfully.");
    } catch (err) {
        return res.status(500).send("Something went wrong");
    }
};

const getDeliveryAddress = async (req, res) => {
    try {
        const allAddress = await Delivery.find(
            {
                userId: _.get(req, "body.userDetails._id"),
            },
            { userId: 0 }
        );
        return res.status(200).send({ data: allAddress });
    } catch (err) {
        return res.status(500).send("Something went wrong");
    }
};

const deleteDeliveryAddress = async (req, res) => {
    try {
        let { id } = req.params;
        const result = await Delivery.findByIdAndDelete({ _id: id });
        return res.status(200).send({ data: result });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong");
    }
};

module.exports = {
    addDeliveryAddress,
    getDeliveryAddress,
    deleteDeliveryAddress,
};
