const { authJwt } = require("../middleware");

module.exports = app => {
    const Person = require("../controllers/person.controller.js");
    
    var router = require("express").Router();

    // All routes below require a logged-in user
    router.use(authJwt.verifyToken);
  
    // Create a new Person
    router.post("/", Person.create);
  
    // Retrieve all People
    router.get("/", Person.findAll);
  
    // Retrieve a single Person with id
    router.get("/:id", Person.findOne);
  
    // Update a Person with id
    router.put("/:id", Person.update);

    router.delete("/:id", Person.delete);
  
    app.use('/api/person', router);
};