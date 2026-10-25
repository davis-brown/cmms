const { authJwt } = require("../middleware");

module.exports = app => {
    const lifeeventperson = require("../controllers/lifeventperson.controller.js");
    
    var router = require("express").Router();

    // All routes below require a logged-in user
    router.use(authJwt.verifyToken);
  
    // Create a new life event person
    router.post("/", authJwt.isModeratorOrAdmin, lifeeventperson.create);
  
    // Retrieve all life events
    router.get("/", lifeeventperson.findLifeEventForPerson);
  

    router.get("/:id", lifeeventperson.findOne);

    router.put("/:id", authJwt.isModeratorOrAdmin, lifeeventperson.update);
  
    
    router.delete("/:id", authJwt.isModeratorOrAdmin, lifeeventperson.delete);
    
    app.use('/api/lifeventperson', router);
};