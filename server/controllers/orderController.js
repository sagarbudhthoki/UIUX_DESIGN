const mongoose = require("mongoose");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Order = require("../models/order");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");

//create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    message: "order create successfully!",
    order,
  });
});

//get single orders
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "fullName email"
  );

  if (!order)
    return next(new ErrorHandler("order not found with this Id", 404));

  res.status(200).json({
    success: true,
    data: order,
  });
});

//get logged in user Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    data: orders,
  });
});

//get all orders by admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find().populate("user", "fullName");

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    totalAmount,
    data: orders,
  });
});

//update Order status by admin

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }
  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      if (o.product) {
        await updateStock(o.product, o.quantity);
      }
    });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false }, (err) => {
    if (err) {
      return next(new ErrorHandler("Error updating order status", 500));
    }
    order.orderStatus = req.body.status;
    res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      data: order,
    });
  });
});

async function updateStock(id, quantity) {
  console.log("Product ID:", id);
  const product = await Product.findById(id);
  console.log("Product:", product);
  if (!product) {
    throw new ErrorHandler("Product not found with this Id", 404);
  }
  product.IsInStock -= quantity;

  await product.save({ validateBeforeSave: false });
}
// exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
//   console.log(req.body);
//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return next(new ErrorHandler("Order not found with this Id", 404));
//   }

//   if (order.orderStatus === "Delivered") {
//     return next(new ErrorHandler("You have already delivered this order", 400));
//   }

//   if (order.orderStatus !== "Shipped" && req.body.status === "Shipped") {
//     // Update stock for all order items only when status is changed to "Shipped"
//     for (const orderItem of order.orderItems) {
//       await updateStock(orderItem.product, orderItem.quantity);
//     }
//   }

//   order.orderStatus = req.body.status;

//   if (req.body.status === "Delivered") {
//     order.deliveredAt = Date.now();
//   }

//   await order.save({ validateBeforeSave: false });
//   res.status(200).json({
//     success: true,
//   });
// });

// async function updateStock(id, quantity) {
//   const product = await Product.findById(id);
//   if (!product) {
//     console.log(`Product not found with id: ${id}`);
//     throw new ErrorHandler("Product not found with this Id", 404);
//   }
//   console.log(
//     `Updating stock for product: ${product.productName} (id: ${product._id})`
//   );
//   product.IsInStock -= quantity;

//   await product.save({ validateBeforeSave: false });
// }
//delete Order
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return next(new ErrorHandler("order not found with this Id", 404));

  await order.remove();
  res.status(200).json({
    success: true,
    message: "order delete successfully!",
  });
});
