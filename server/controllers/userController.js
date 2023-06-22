const User = require("../models/user");
const getDataUri = require("../utils/DataUri");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { sendMail } = require("../utils/sendMail");

//register
exports.register = catchAsyncErrors(async (req, res, next) => {
  const { fullName, mobileNo, email, password } = req.body;
  if (!fullName || !mobileNo || !email || !password)
    return next(new ErrorHandler("field can't be empty!", 400));
  if (!/^\d{10}$|^\d{1,9}$/.test(mobileNo)) {
    return next(new ErrorHandler("mobileNo must be 10 digit long!", 400));
  } else if (mobileNo.length < 10) {
    return next(
      new ErrorHandler("mobileNo must be at least 10 digit long!", 400)
    );
  } else if (mobileNo.length > 10) {
    return next(new ErrorHandler("mobileNo can't be less than 10 digit!", 400));
  }

  if (!/\S+@\S+\.\S+/.test(email))
    return next(new ErrorHandler("email must be valid!", 400));
  if (password.length < 8)
    return next(new ErrorHandler("password must be 8 characters long!", 400));

  let file;
  if (req.file) {
    file = req.file;
  } else {
    return next(new ErrorHandler("file was not upload!", 400));
  }

  const exists = await User.findOne({ email });
  if (exists) return next(new ErrorHandler("email already exist!"));
  const fileUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    folder: "profileImg",
  });

  const otp = Math.floor(Math.random() * 1000000);
  const user = await User.create({
    fullName,
    mobileNo,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    otp,
    otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
  });
  await sendMail(
    email,
    "HamroShop Alert!",
    `Your verify OTP code is : ${otp}. Do not share your otp with anyone. ThankYoy!`
  );

  const token = user.getJwtToken();

  res.status(201).json({
    success: true,
    message: "OTP sent to your email,verify your account!",
    user,
    token,
  });
});

//verify otp
exports.verifyAccount = catchAsyncErrors(async (req, res, next) => {
  const otp = Number(req.body.otp);
  if (!otp) return next(new ErrorHandler("Invalid otp!", 400));

  const user = await User.findById(req.user.id);

  if (user.otp !== otp || user.otp_expiry < Date.now()) {
    // delete the image from Cloudinary if it exists
    if (user.avatar && user.avatar.public_id) {
      try {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      } catch (err) {
        console.error(err);
      }
    }

    return next(new ErrorHandler("Invalid OTP or has been expired!", 400));
  }

  user.verified = true;
  user.otp = null;
  user.otp_expiry = null;

  await user.save();

  const token = user.getJwtToken();

  res.status(200).json({
    success: true,
    message: "Account verified successfully!",
    user,
    token,
  });
});

//login
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("field must be filled!", 400));

  if (!/\S+@\S+\.\S+/.test(email))
    return next(new ErrorHandler("email must be valid!", 400));
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("user doesn't exist!", 404));

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler("Invalid credentials!", 400));

  const token = user.getJwtToken();
  res.status(200).json({
    success: true,
    message: "login successfully!",
    user,
    token,
  });
});

//update profile
exports.profileUpdate = catchAsyncErrors(async (req, res, next) => {
  const { fullName, mobileNo, email } = req.body;
  if (!fullName || !mobileNo || !email)
    return next(new ErrorHandler("filed must be filled!", 400));

  if (!/^\d{10}$|^\d{1,9}$/.test(mobileNo)) {
    return next(new ErrorHandler("mobileNo must be 10 digit long!", 400));
  } else if (mobileNo.length < 10) {
    return next(
      new ErrorHandler("mobileNo must be at least 10 digit long!", 400)
    );
  } else if (mobileNo.length > 10) {
    return next(new ErrorHandler("mobileNo can't be less than 10 digit!", 400));
  }

  if (!/\S+@\S+\.\S+/.test(email))
    return next(new ErrorHandler("email must be valid!", 400));

  let file;
  if (req.file) {
    file = req.file;
  } else {
    return next(new ErrorHandler("file was not upload!", 400));
  }

  let user = await User.findById(req.user.id);
  if (!user) return next(new ErrorHandler("user not found!", 404));
  let myCloud;
  if (file) {
    if (user.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id, {
        folder: "profileImg",
      });
    }
    const fileUri = getDataUri(file);
    myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: "profileImg",
    });
  }

  user = await User.findByIdAndUpdate(
    req.user.id,
    {
      fullName,
      mobileNo,
      email,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res.status(200).json({
    success: false,
    message: "profile update successfully!",
    user,
  });
});

//change password
exports.changePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("field must be filled!", 400));

  if (newPassword !== confirmPassword)
    return next(new ErrorHandler("password must be match!", 400));

  const user = await User.findById(req.user.id).select("+password");
  if (!user) return next(new ErrorHandler("User not found!", 404));
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch)
    return next(new ErrorHandler("Old password is incorrect!", 400));
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "password changed successfully!",
  });
});

//forget password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("Invalid email", 400));

  const otp = Math.floor(Math.random() * 1000000);
  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();
  const message = `Your OTP for resetting the password ${otp}. If you did not request for this,please ignore this email.`;
  await sendMail(email, "Request for Resetting Password", message);

  res.status(200).json({
    success: true,
    message: `OTP sent to ${email}`,
  });
});

//reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { otp, newPassword } = req.body;
  if (!otp || !newPassword)
    return next(new ErrorHandler("filled must be filled!", 400));

  const user = await User.findOne({
    resetPasswordOtp: otp,
    resetPasswordOtpExpiry: { $gt: Date.now() },
  });
  if (!user)
    return next(new ErrorHandler("Otp Invalid or has been Expired", 400));
  user.password = newPassword;
  user.resetPasswordOtp = null;
  user.resetPasswordOtpExpiry = null;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully!",
  });
});
//logged in single user
exports.singleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new ErrorHandler("user does not exist!", 404));
  res.status(200).json({
    success: true,
    message: "user get successfully!",
    data: user,
  });
});

//admin get all users(only admin can)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  if (!users) return next(new ErrorHandler("users does not exist!", 404));

  res.status(200).json({
    success: true,
    message: "users get successfully!",
    data: users,
  });
});
//get single user by only admin
exports.getSingleUserByAdmin = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) return next(new ErrorHandler("user does not exist!", 404));

  res.status(200).json({
    success: true,
    message: "user get successfully!",
    data: user,
  });
});
//delete user from database(only admin can)
exports.deleteSingleUser = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler("user does not exist", 404));
  const imgId = user.avatar.public_id;
  if (imgId) {
    await cloudinary.v2.uploader.destroy(imgId, {
      folder: "profileImg",
    });
  }

  await user.remove();
  res.status(200).json({
    success: true,
    message: "user delete successfully!",
  });
});

//update user role by admin only
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user)
    return next(new ErrorHandler("user does not exist with this ID", 404));
  const newUserData = {
    fullName: req.body.fullName,
    mobileNo: req.body.mobileNo,
    email: req.body.email,
    role: req.body.role,
  };

  user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "user role update successfully!",
    user,
  });
});
