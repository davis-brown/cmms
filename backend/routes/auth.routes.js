const { verifySignUp } = require("../middleware");
const rateLimits = require("../middleware/rateLimits");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.post(
    "/api/auth/signup",
    [...rateLimits.signup, verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signup
  );

  app.post("/api/auth/signin", rateLimits.signin, controller.signin);
};