const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((data) => {
      console.log(`Database Connected to ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(`Could not connect to database ` + err);
    });
};

module.exports = dbConnection;
