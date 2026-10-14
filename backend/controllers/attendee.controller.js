const db = require("../models");
const Attendee = db.attendee;
const Event = db.event;
const User = db.user;

// An event's attendance is the number of different users who RSVP'd to it
const refreshAttendance = (evt_ID) => {
    return Attendee.count({ where: { evt_ID: evt_ID }, distinct: true, col: "username" })
        .then(count => Event.update({ attendance: count }, { where: { evt_ID: evt_ID } }));
};

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

        return Attendee.create(attendee)
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

// Update an Attendee by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Attendee.update(req.body, {
        fields: db.updatableFields(Attendee),
        where: {
            atd_ID: id
        }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Attendee was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Attendee with id=${id}. Maybe Attendee was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Attendee with id=" + id
        });
    });
};

// Delete an Attendee with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Attendee.destroy({
        where: {
            atd_ID: id
        }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Attendee was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Attendee with id=${id}. Maybe Attendee was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Attendee with id=" + id
        });
    });
};

