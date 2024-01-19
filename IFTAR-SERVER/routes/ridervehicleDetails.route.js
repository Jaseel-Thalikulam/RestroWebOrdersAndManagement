const express = require("express");
const router = express.Router();
const {
 createVehicleDetails,getVehicleDetails
} = require("../controllers/riderVehicleDetails.controller");

router.post("/create_vehicle_details", createVehicleDetails).get("/get_vehicle_details", getVehicleDetails);

module.exports=router