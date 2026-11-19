const { authJwt } = require("../middleware");

module.exports = app => {
    const Attendee = require("../controllers/attendee.controller.js");
    
    var router = require("express").Router();

    // All routes below require a logged-in user
    router.use(authJwt.verifyToken);
  
    // Create a new Attendee
    router.post("/", Attendee.create);
  
    // Retrieve all Attendees
    router.get("/", Attendee.findAttendeeForEvent);
  
    // Cancel the logged-in user's own RSVP: DELETE /api/attendee?events=<evt_ID>
    router.delete("/", Attendee.deleteMine);
  
    // Retrieve a single Attendee with id
    router.get("/:id", Attendee.findOne);
  
    app.use('/api/attendee', router);
};