const mongoose = require("mongoose");

const productTypeSchema = mongoose.Schema({
  Type: {
    type: String,
  },
  TypePrice: {
    type: Number,
  },
  TypeOfferPrice: {
    type: Number,
  },
  TypeOfferPercentage: {
    type: Number,
  },
});
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    
  },
  offer: {
    type: String,
    
  },
  types: [productTypeSchema],

  discountPrice: {
    type: Number,

  },
  discountPercentage: {
    type: Number,

  },
  isVeg: {
    type:Boolean
  },
  status: {
    type: Boolean,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  subCategoryId: {
    type: String,
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  subCategoryName: {
    type: String,
    required: true,
  },
},
{
  timestamps: true, // This will add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("product", productSchema);
