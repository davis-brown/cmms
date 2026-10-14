const { authJwt } = require("../middleware");

module.exports = app => {
    const Personcontact = require("../controllers/personcontact.controller.js");
    
    var router = require("express").Router();

    // All routes below require a logged-in user
    router.use(authJwt.verifyToken);
  
    // Create a new Course
    router.post("/", authJwt.isModeratorOrAdmin, Personcontact.create);
  
    // Retrieve all Majors
    router.get("/", Personcontact.findAll);
  
    // Retrieve a single Course with id
    router.get("/:id", Personcontact.findOne);
  
    // Update a Course with id
    router.put("/:id", authJwt.isModeratorOrAdmin, Personcontact.update);
  
    // Delete a Course with id
    router.delete("/:id", authJwt.isModeratorOrAdmin, Personcontact.delete);
  
    // Delete all Majors
    router.delete("/", authJwt.isModeratorOrAdmin, Personcontact.deleteAll);
  
    app.use('/api/personcontact', router);
};