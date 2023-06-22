const multer = require("multer");

//storage make
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/gallery");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

//fliter file

const filefilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  filterfilter: filefilter,
});
module.exports = upload;
