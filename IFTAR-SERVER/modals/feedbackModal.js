const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        mobileNumber: {
            type: Number,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        ratings: {
            type: String,
            required: true,
        },
        options: {
            default: "no",
            type: String,
        },
        userRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        user_image: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("feedback", feedbackSchema);
