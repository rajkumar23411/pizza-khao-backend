const Feedback = require("../models/feedback");
const CustomErrorHandler = require("../middlewares/CustomErrorHandler");
const feedbackController = {
  async addFeedback(req, res, next) {
    try {
      const { firstname, lastname, rating, comment } = req.body;
      const { id } = req.user;
      console.log(req.user);
      if (!id)
        return next(
          CustomErrorHandler.unAuthorized("Please login to continue")
        );

      if (!firstname || !lastname || !rating || !comment)
        return next(CustomErrorHandler.badRequest("Please fill all fields"));

      const feedback = await Feedback.findOne({ user: id });

      if (!feedback) {
        await Feedback.create({
          firstname,
          lastname,
          rating,
          comment,
          user: id,
        });
        res
          .status(201)
          .json({ message: "Feedback added successfully", success: true });
      } else {
        feedback.firstname = firstname;
        feedback.lastname = lastname;
        feedback.rating = rating;
        feedback.comment = comment;
        await feedback.save();

        res.json({ message: "Feedback updated successfully", success: true });
      }
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },
  async isFeedbackAdded(req, res, next) {
    try {
      const feedback = await Feedback.findOne({ user: req.user.id });
      if (feedback) {
        res.json({ message: "Feedback added", success: true });
      } else {
        res.json({ message: "Feedback not added", success: false });
      }
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },
  async getAllFeedback(req, res, next) {
    try {
      const feedbacks = await Feedback.find();
      res.status(200).json({ success: true, feedbacks });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = feedbackController;
