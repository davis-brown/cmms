const db = require("../models");
const Attendee = db.attendee;
const Event = db.event;
const User = db.user;

// An event's attendance is the number of different users who RSVP'd to it
const refreshAttendance = (evt_ID, transaction) => {
    return Attendee.count({ where: { evt_ID: evt_ID }, distinct: true, col: "username", transaction })
        .then(count => Event.update({ attendance: count }, { where: { evt_ID: evt_ID }, transaction }));
};
exports.refreshAttendance = refreshAttendance;

// Create and Save a new Attendee
exports.create = (req, res) => {
    if (!req.body || !req.body.evt_ID) {
        res.status(400).send({
            message: "Content can NOT be empty!"
        });
        return;
    }

    // The RSVP is always made as the logged-in user
    User.findByPk(req.userId)
    .then(user => {
        const attendee = {
            evt_ID: req.body.evt_ID,
            per_ID: req.body.per_ID,
            username: user.username,
            contribution: req.body.contribution
        };

        // One RSVP per user per event: a second RSVP updates the latest one
        return Attendee.findOne({ where: { evt_ID: attendee.evt_ID, username: user.username }, order: [["atd_ID", "DESC"]] })
        .then(existing => existing
            ? existing.update({ contribution: attendee.contribution })
            : Attendee.create(attendee))
        .then(data => refreshAttendance(data.evt_ID).then(() => data));
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Attendee."
        });
    });
};

// Cancel the logged-in user's RSVP to an event (all their rows, so old duplicates go too)
exports.deleteMine = (req, res) => {
    const evt_ID = req.query.events;
    if (!evt_ID) {
        res.status(400).send({ message: "Which event? events is required." });
        return;
    }

    User.findByPk(req.userId)
    .then(user => Attendee.destroy({ where: { evt_ID: String(evt_ID), username: user.username } }))
    .then(count => refreshAttendance(evt_ID).then(() => res.send({ message: count + " RSVP(s) removed." })))
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while cancelling the RSVP."
        });
    });
};

// Retrieve all Attendees from the database.
exports.findAttendeeForEvent = (req, res) => {
    const evt_ID = req.query.events;  

    var condition = evt_ID ? { evt_ID: String(evt_ID) } : null;

    Attendee.findAll({include:["event"], where: condition }) 
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Attendees."
        });
    });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Attendee.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Attendee with id=" + id
        });
    });
};
