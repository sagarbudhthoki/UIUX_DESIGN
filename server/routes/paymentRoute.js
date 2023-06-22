const express = require("express");
const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/paymentController");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.route("/process/payment").post(auth, processPayment);
router.route("/stripe/api/key").get(auth, sendStripeApiKey);

module.exports = router;
