const mongoose=require("mongoose")

const videoSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    video:{
        type:String,
        required:true,
    },
 
},{timestamps:true})

module.exports=mongoose.model("video",videoSchema)