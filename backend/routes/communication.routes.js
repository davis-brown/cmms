const { authJwt } = require("../middleware");

module.exports = app => {
    const Communication = require("../controllers/communication.controller.js");
    
    var router = require("express").Router();

    // All routes below require a logged-in user
    router.use(authJwt.verifyToken);

    router.post("/", authJwt.isModeratorOrAdmin, Communication.create);
  
    router.get("/", Communication.findAll);
  
    router.get("/:id", Communication.findOne);
  
    router.put("/:id", authJwt.isModeratorOrAdmin, Communication.update);

    router.delete("/:id", authJwt.isModeratorOrAdmin, Communication.delete);
  
    app.use('/api/communications', router);
};