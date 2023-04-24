const express = require("express");
const app = express();
const dotenv = require("dotenv");
const dbConnection = require("./db");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoutes");
const errorHandler = require("./utils/errorHandler");
const productRoutes = require("./routes/productRoutes");
const addressRoutes = require("./routes/addressRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const fileUpload = require("express-fileupload");

const cors = require("cors");
dotenv.config({ path: "./.env" });

//handling uncaught error
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server has been closed`);
  process.exit(1);
});

//Handling unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server has been closed`);
  server.close(process.exit(1));
});

dbConnection();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors());

app.use("/api", userRoute);
app.use("/api", productRoutes);
app.use("/api", addressRoutes);
app.use("/api", cartRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server started on PORT ${process.env.PORT}`);
});
