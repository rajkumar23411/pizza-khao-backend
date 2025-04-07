const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpsOnly: true,
        secure: process.env.NODE_ENV === "production", // true on HTTPS
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };
    res.status(statusCode).cookie("_pizza_k", token, options).json({
        success: true,
        user,
        token,
    });
};

module.exports = sendToken;
