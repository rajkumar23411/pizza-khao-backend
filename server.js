const express = require("express");
const app = express();
const dotenv = require("dotenv");
const dbConnection = require("./db");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoutes");
const errorHandler = require("./utils/errorHandler");
const productRoutes = require("./routes/productRoutes");
const addressRoutes = require("./routes/addressRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const cors = require("cors");
const path = require("path");
const couponRoutes = require("./routes/couponRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
dotenv.config({ path: "./.env" });

//handling uncaught error
process.on("uncaughtException", (err) => {
    console.log(`Server has been closed due to error -:`, err);
    process.exit(1);
});

//Handling unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Server has been closed due to error -:`, err);
    process.exit(1);
});

dbConnection();

app.use(
    cors({
        origin: [
            "https://pizzakhao.netlify.app",
            "https://pizza-khao-frontend.vercel.app",
            "http://localhost:3000",
        ],
        credentials: true,
    })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoute);
app.use("/api", productRoutes);
app.use("/api", addressRoutes);
app.use("/api", cartRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);
app.use("/api", couponRoutes);
app.use("/api", feedbackRoutes);

app.use(errorHandler);

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server started on PORT ${process.env.PORT}`);
});
