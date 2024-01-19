const mongoose = require("mongoose");

const footerSchema = mongoose.Schema(
  {
    name: String,
    logo: String,
    contactNumber: String,
    address: String,
    email: String,
    colors: {
      primaryColor: String,
      secondaryColor: String,
      thirdColor: String,
      fourthColor: String,
    },
    content:String,
    status:Boolean,
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("footerSettings", footerSchema);
