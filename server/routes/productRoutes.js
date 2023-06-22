const express = require("express");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  singleProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  allProductsByAdmin,
  getAdminSingleProduct,
} = require("../controllers/productController");
const { auth, isAuthAdmin } = require("../middlewares/auth");
const singleUpload = require("../middlewares/multer");
// const upload = require("../file/upload");
const router = express.Router();

//get singleProduct by admin
router
  .route("/admin/single/product/:id")
  .get(auth, isAuthAdmin, getAdminSingleProduct);
//create product route
router
  .route("/add/product")
  .post(auth, isAuthAdmin, singleUpload, createProduct);
//get all products
router.route("/products").get(getAllProducts);
//get single product
router.route("/single/product/:id").get(singleProduct);
// update product
router
  .route("/product/update/:id")
  .put(auth, isAuthAdmin, singleUpload, updateProduct);
//delete product
router.route("/product/delete/:id").delete(auth, isAuthAdmin, deleteProduct);

//add update reviews product
router.route("/add/reviews").put(auth, createProductReview);
//get all reviews
router.route("/reviews").get(getProductReviews);
//delete product reviews
router.route("/delete/review").delete(auth, isAuthAdmin, deleteReview);

//admin routes
router.route("/all/products").get(auth, isAuthAdmin, allProductsByAdmin);
module.exports = router;
