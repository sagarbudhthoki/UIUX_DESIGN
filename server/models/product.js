const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      maxLength: [30, "character must be at least 30!"],
      minLength: [4, "product character must be 4"],
      required: [true, "please filled productName!"],
    },
    description: {
      type: String,
      required: [true, "description field must be filled!"],
    },
    productImg: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },

    category: {
      type: String,
      required: [true, "Please select a category!"],
    },
    SKU: {
      type: String,
      required: [true, "Please provide a SKU for the product!"],
    },
    manufacturer: {
      type: String,
      required: [true, "Please specify the manufacturer!"],
    },
    ratings: {
      type: Number,
      default: 0,
    },

    IsInStock: {
      type: Number,
      required: [true, "Please Enter product stock"],
      maxLength: [4, "Stock cannot exceed 4 characters"],
      default: 1,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "user",
          required: true,
        },
        fullName: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },

    price: {
      type: Number,
      required: [true, "Please Enter Product price"],
      maxLength: [8, "Price cannot exceed 8 characters"],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
