const { authJwt } = require("../middleware");

module.exports = app => {
    const Groupmember = require("../controllers/groupmember.controller.js");
    
    var router = require("express").Router();

    // All routes below require a logged-in user
    router.use(authJwt.verifyToken);
  
    // Create a new Course
    router.post("/", authJwt.isModeratorOrAdmin, Groupmember.create);
  
    // Retrieve all Majors
    router.get("/", Groupmember.findMemberForGroup);
  
    // Retrieve a single Course with id
    router.get("/:id", Groupmember.findOne);
  
    // Update a Course with id
    router.put("/:id", authJwt.isModeratorOrAdmin, Groupmember.update);
  
    // Delete a Course with id
    router.delete("/:id", authJwt.isModeratorOrAdmin, Groupmember.delete);
  
    app.use('/api/groupmember', router);
};