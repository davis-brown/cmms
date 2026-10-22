const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  // Account management: approve sign-ups, change roles, delete accounts
  app.get("/api/users", [authJwt.verifyToken, authJwt.isAdmin], controller.listUsers);
  app.put("/api/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.updateUser);
  app.delete("/api/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);
};