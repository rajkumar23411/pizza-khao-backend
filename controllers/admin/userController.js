const CustomErrorHandler = require("../../middlewares/CustomErrorHandler");
const User = require("../../models/user");
const userController = {
    async getAllUsers(req, res, next) {
        try {
            const users = await User.find();
            const usersCount = await User.countDocuments();
            res.status(200).json({ users, usersCount });
        } catch {
            console.log(error);
            return CustomErrorHandler.serverError("Something went wrong");
        }
    },
};
module.exports = userController;
