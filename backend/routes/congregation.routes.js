const { authJwt } = require("../middleware");

module.exports = app => {
    const Congregation = require("../controllers/congregation.controller.js");
    
    var router = require("express").Router();

    // All routes below require a logged-in user
    router.use(authJwt.verifyToken);
  
    // Create a new Person
    router.post("/", authJwt.isModeratorOrAdmin, Congregation.create);
  
    // Retrieve all People
    router.get("/", Congregation.findAll);
  
    // Retrieve a single Person with id
    router.get("/:id", Congregation.findOne);
  
    // Update a Person with id
    router.put("/:id", authJwt.isModeratorOrAdmin, Congregation.update);
    router.delete("/:id", authJwt.isModeratorOrAdmin, Congregation.delete);
    app.use('/api/congregation', router);
};