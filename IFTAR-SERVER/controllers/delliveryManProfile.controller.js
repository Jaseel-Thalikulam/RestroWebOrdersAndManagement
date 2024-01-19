const Profile = require("../modals/DeliveryManProfileModal");

const createDeliveryManProfile = async (req, res) => {
  try {
    const result=await Profile.create({...req.body})
    return res.status(200).send({message:result})
  } catch (err) {
    console.log(err);
  }
};

const getDeliveryManProfile = async (req, res) => {
  try {
    const result=await Profile.find({})
    return res.status(200).send({data:result})
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createDeliveryManProfile, getDeliveryManProfile };
