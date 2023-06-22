const Product = require("../models/product");
const getDataUri = require("../utils/DataUri");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apiFeatures");

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const {
    productName,
    description,
    category,
    SKU,
    manufacturer,
    ratings,
    IsInStock,
    price,
    numOfReviews,
  } = req.body;

  req.body.user = req.user.id;

  let file;
  if (req.file) {
    file = req.file;
  } else {
    return next(new ErrorHandler("file was not uploaded!", 400));
  }

  if (
    !productName ||
    !description ||
    !category ||
    !SKU ||
    !manufacturer ||
    !IsInStock ||
    !price
  )
    return next(new ErrorHandler("field must be filled!", 400));
  const fileUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    folder: "productImg",
  });

  const product = await Product.create({
    productName,
    description,
    category,
    SKU,
    manufacturer,
    ratings,
    IsInStock,
    price,
    numOfReviews,
    productImg: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },

    user: req.user.id,
    // productImg: file,
  });

  //population(populate);
  await product.populate({ path: "user", select: "fullName" });

  res.status(201).json({
    success: true,
    message: "product create successfully!",
    product,
  });
});

//getallProducts
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();
  const apifeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await apifeatures.query;

  if (!products) return next(new ErrorHandler("product not found!", 404));
  res.status(200).json({
    success: true,
    message: "products get successfully!",
    data: products,
    productsCount,
    resultPerPage,
  });
});
//get single product (basis on id)
exports.singleProduct = catchAsyncErrors(async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("product not found!", 404));
  res.status(200).json({
    success: true,
    message: "product get successfully!",
    data: product,
  });
});

//update product
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const {
    productName,
    description,
    category,
    SKU,
    manufacturer,
    ratings,
    IsInStock,
    price,
    numOfReviews,
  } = req.body;

  let file;
  if (req.file) {
    file = req.file;
  } else {
    return next(new ErrorHandler("file was not upload!", 400));
  }

  const productId = req.params.id;
  let product = await Product.findById(productId);

  if (!product) return next(new ErrorHandler("product not found!", 404));

  if (
    !productName ||
    !description ||
    !category ||
    !SKU ||
    !manufacturer ||
    !IsInStock ||
    !price
  )
    return next(new ErrorHandler("filed must be filled!"));
  let myCloud;
  if (file) {
    if (product.productImg.public_id) {
      await cloudinary.v2.uploader.destroy(product.productImg.public_id, {
        folder: "productImg",
      });
    }
    const fileUri = getDataUri(file);
    myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: "productImg",
    });
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      productName,
      description,
      category,
      SKU,
      manufacturer,
      ratings,
      IsInStock,
      price,
      numOfReviews,
      productImg: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },

      // productImg: file,
    },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res.status(200).json({
    success: true,
    message: "Product updated successfully!",
    product,
  });
});

//delete products(only admin can)
exports.deleteProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("product not found!", 404));
  const productImageId = product.productImg.public_id;
  if (productImageId) {
    await cloudinary.v2.uploader.destroy(productImageId, {
      folder: "productImg",
    });
  }

  await product.remove();
  res.status(200).json({
    success: true,
    message: "product delete successfully!",
  });
});

//create and update review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    fullName: req.user.fullName,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) return next(new ErrorHandler("product not found!", 404));

  if (!product.reviews) {
    product.reviews = [];
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "review submit successfully!",
  });
});

//get all reviews of a products
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) return next(new ErrorHandler("product not found!", 404));

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) return next(new ErrorHandler("product not found!", 404));

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg / reviews.length;
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, numOfReviews },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res.status(200).json({
    success: true,
    message: "review delete successfully!",
  });
});

//single user get by admin
exports.getAdminSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("product not found!", 404));
  res.status(200).json({
    success: true,
    message: "product get successfully!",
    data: product,
  });
});
//all products gets by admin
exports.allProductsByAdmin = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();
  if (!products) return next(new ErrorHandler("product not found!", 404));

  res.status(200).json({
    success: true,
    message: "users get successFully!",
    data: products,
  });
});
