const mongoose =require("mongoose")

const ridervehicleDetails=mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    rcBook:{
        type:String,
        required:true
    },
    bikeVideo:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
},{timestamps:true})


module.exports=mongoose.model("riderVehicleDetails",ridervehicleDetails)