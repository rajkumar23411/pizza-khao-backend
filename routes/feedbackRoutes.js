const feedbackRoutes = require("express").Router();
const feedbackController = require("../controllers/feedbackController");
const { auth } = require("../middlewares/auth");

feedbackRoutes.post("/feedback/new", [auth], feedbackController.addFeedback);
feedbackRoutes.get("/feedbacks", feedbackController.getAllFeedback);
feedbackRoutes.get(
  "/feedback_added",
  [auth],
  feedbackController.isFeedbackAdded
);

module.exports = feedbackRoutes;
