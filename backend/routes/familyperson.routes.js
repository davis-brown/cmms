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
  
    // Only staff may add people to a family: being in someone's family reveals
    // their contact details, so members can't add people to their own
    router.post("/", authJwt.isModeratorOrAdmin, Familyperson.create);
  
    // Retrieve all Majors
    router.get("/", Familyperson.findPeopleForFamily);
  
    // Retrieve a single Course with id
    router.get("/:id", Familyperson.findOne);
  
    // Update a Course with id
    router.put("/:id", authJwt.isModeratorOrAdmin, Familyperson.update);
  
    // Delete a Course with id
    router.delete("/:id", authJwt.isFamilyMemberOrModerator(famIdOfRow), Familyperson.delete);
  
    app.use('/api/familyperson', router);
};