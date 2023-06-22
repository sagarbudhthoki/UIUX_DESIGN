const multer = require("multer");

//make storage
const storage = multer.memoryStorage();

const singleUpload = multer({ storage }).single("file");

module.exports = singleUpload;
