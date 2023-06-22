const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const ConnectDB = async () => {
  const { connection } = await mongoose.connect(process.env.MONGODB_URL);
  console.log(
    `MongoDB is connected at : ${connection.host}`.cyan.underline.bold
  );
};

module.exports = ConnectDB;
