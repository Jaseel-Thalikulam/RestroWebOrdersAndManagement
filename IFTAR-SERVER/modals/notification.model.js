const mongoose=require("mongoose")

const notificationSchema=mongoose.Schema({
    heading:{
        type:String,
        required:true,
    },
    field:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
},{timestamps:true})


module.exports=mongoose.model("notification",notificationSchema)