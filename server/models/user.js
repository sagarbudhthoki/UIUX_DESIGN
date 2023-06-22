const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "fullName must be filled!"],
      maxLength: [30, "Name Cannot exceed 30 characters"],
      minLength: [4, "Name should have more than 4 characters"],
    },
    mobileNo: {
      type: Number,
      required: [true, "mobile number can't be empty!"],
    },
    email: {
      type: String,
      required: [true, "Please Enter your email"],
      unique: true,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    password: {
      type: String,
      required: [true, "Please Enter your password"],
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user",],
      default: "user",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otp: Number,
    otp_expiry: Date,
    resetPasswordOtp: Number,
    resetPasswordOtpExpiry: Date,
  },
  { timestamps: true }
);

//hashed password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
// userSchema.pre("save", async function (next) {
//   if (!this.isModified) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

//generate token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};

//compare password

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//for otp date expire(mongodb bata afai 5 min ma otp manilayepaxi)
userSchema.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 });
const User = mongoose.model("user", userSchema);
module.exports = User;
