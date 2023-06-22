const express = require("express");
const {
  register,
  login,
  profileUpdate,
  changePassword,
  singleUser,
  getAllUsers,
  getSingleUserByAdmin,
  deleteSingleUser,
  updateUserRole,
  verifyAccount,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { auth, isAuthAdmin } = require("../middlewares/auth");

const singleUpload = require("../middlewares/multer");
const router = express.Router();

//register
router.route("/register").post(singleUpload, register);
//login route
router.route("/login").post(login);
//verify account
router.route("/verify").post(auth, verifyAccount);
//update profile
router.route("/profile/update").put(auth, singleUpload, profileUpdate);
//changed password
router.route("/change/password").put(auth, changePassword);
//forget password
router.route("/forget/password").post(forgotPassword);
//reset password
router.route("/reset/password").put(resetPassword);
//get logged user
router.route("/me").get(auth, singleUser);

//for admin routes
router.route("/all/users").get(auth, isAuthAdmin, getAllUsers);
//for single user only admin can get
router.route("/single/user/:id").get(auth, isAuthAdmin, getSingleUserByAdmin);

//delete single user by admin only
router.route("/delete/user/:id").delete(auth, isAuthAdmin, deleteSingleUser);

//update user role by admin only
router.route("/update/role/:id").put(auth, isAuthAdmin, updateUserRole);
module.exports = router;
