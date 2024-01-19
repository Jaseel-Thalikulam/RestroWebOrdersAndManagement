const mongoose=require("mongoose")

const walletBalanceSchema=mongoose.Schema({
    balance:{
        type:Number,
        required:true,
    }
})


module.exports=mongoose.model("walletBalance",walletBalanceSchema)