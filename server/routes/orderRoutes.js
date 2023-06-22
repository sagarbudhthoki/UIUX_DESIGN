const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { auth, isAuthAdmin } = require("../middlewares/auth");
const router = express.Router();

//create order;
router.route("/new/order").post(auth, newOrder);

//get single order
router.route("/single/order/:id").get(auth, getSingleOrder);
//get logged in user
router.route("/orders/me").get(auth, myOrders);
//get all orders by admin
router.route("/admin/orders").get(auth, isAuthAdmin, getAllOrders);
//update order
router.route("/update/order/:id").put(auth, isAuthAdmin, updateOrder);
//delete order
router.route("/delete/order/:id").delete(auth, isAuthAdmin, deleteOrder);

module.exports = router;
