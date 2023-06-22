const express = require("express");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv");
const ConnectDB = require("./config/db");
const Razorpay = require("razorpay");
const logger = require("morgan");
const cloudinary = require("cloudinary");
const errorMiddleware = require("./middlewares/error");

//configure
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cors());

//handled unCaughtException
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`.red);
  console.log(`Shutting down the server to handled unCaughtException!`);
  process.exit(1);
});

//database connect
ConnectDB();

//cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//razorpay
exports.instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//routes
app.use("/api/v1/", require("./routes/productRoutes"));
app.use("/api/v1/", require("./routes/userRoute"));
app.use("/api/v1/", require("./routes/orderRoutes"));
app.use("/api/v1/", require("./routes/paymentRoute"));

//url to provide access for image
app.use(express.static("public/gallery"));
//server is working or not
app.get("/", (req, res) => {
  res.send("<h1>Server is working</h1>");
});

//middleware call
app.use(errorMiddleware);
//port
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(
    `Server is running at port: http://localhost:${PORT}`.cyan.underline.bold
  );
});

//to handle promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`.red);
  console.log(`Shutting down the server to handled promise Rejection!`);
  server.close(() => {
    process.exit(1);
  });
});
