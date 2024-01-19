const mongoose = require("mongoose")

const deliverdmanprofileSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
    },
    aadharCard: {
        type: String, 
    },
    panCard: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model("deliveryManProfile", deliverdmanprofileSchema)