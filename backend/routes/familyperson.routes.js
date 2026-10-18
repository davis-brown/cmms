const { authJwt } = require("../middleware");
const db = require("../models");

module.exports = app => {
    const Familyperson = require("../controllers/familyperson.controller.js");
    
    var router = require("express").Router();

    // The family a family-person row belongs to, for permission checks
    const famIdOfRow = req => db.familyperson.findByPk(req.params.id)
        .then(row => row && row.fam_ID);

    // All routes below require a logged-in user
    router.use(authJwt.verifyToken);
  
    // Create a new Course
    router.post("/", authJwt.isFamilyMemberOrModerator(req => req.body.fam_ID), Familyperson.create);
  
    // Retrieve all Majors
    router.get("/", Familyperson.findPeopleForFamily);
  
    // Retrieve a single Course with id
    router.get("/:id", Familyperson.findOne);
  
    // Update a Course with id
    router.put("/:id", authJwt.isModeratorOrAdmin, Familyperson.update);
  
    // Delete a Course with id
    router.delete("/:id", authJwt.isFamilyMemberOrModerator(famIdOfRow), Familyperson.delete);
  
    // Delete all Majors
    router.delete("/", authJwt.isModeratorOrAdmin, Familyperson.deleteAll);
  
    app.use('/api/familyperson', router);
};