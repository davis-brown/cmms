const { authJwt } = require("../middleware");

module.exports = app => {
    const Family = require("../controllers/family.controller.js");
    
    var router = require("express").Router();

    // All routes below require a logged-in user
    router.use(authJwt.verifyToken);
  
    // Create a new Course
    router.post("/", authJwt.isModeratorOrAdmin, Family.create);

    // With a fam_ID the photo replaces that family's photo; without one it's
    // a photo for a family that's about to be created
    router.post('/upload', authJwt.isFamilyMemberOrModerator(req => req.body.fam_ID), Family.upload);
  
    // Retrieve all Majors
    router.get("/", Family.findAll);
  
    // Retrieve a single Course with id
    router.get("/:id", Family.findOne);
  
    // Update a Course with id
    router.put("/:id", authJwt.isFamilyMemberOrModerator(req => req.params.id), Family.update);
  
    // Delete a Course with id
    router.delete("/:id", authJwt.isModeratorOrAdmin, Family.delete);
  
    // Delete all Majors
    router.delete("/", authJwt.isAdmin, Family.deleteAll);
  
    app.use('/api/families', router);
};