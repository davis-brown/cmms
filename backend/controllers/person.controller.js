const db = require("../models");
const Person = db.person;
//const Op = db.Sequelize.Op;

// A blank login username means "not linked"; store it as NULL so the unique
// index doesn't treat every unlinked member as a duplicate
const normalizeUserName = (user_name) => {
    if (user_name === undefined) return undefined;
    const trimmed = user_name == null ? "" : String(user_name).trim();
    return trimmed === "" ? null : trimmed;
};

const LOGIN_ALREADY_LINKED = { message: "That login username is already linked to another member." };

// Create and Save a new Person
exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can NOT be empty!"
        });
        return;
    }

    // Create a Person
    const person = {
        per_ID: req.body.per_ID,
        fam_ID: req.body.fam_ID,
        frst_name: req.body.frst_name,
        midl_name: req.body.midl_name,
        last_name: req.body.last_name,
        user_name: normalizeUserName(req.body.user_name),
        role_value: req.body.role_value,
        password: req.body.password,
        bday: req.body.bday,
        baptised: req.body.baptised,
        bapt_date: req.body.bapt_date,
        employer: req.body.employer,
        pub_permission: req.body.pub_permission,
        church_pos: req.body.church_pos,
        fam_pos: req.body.fam_pos,
        notes: req.body.notes,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address
    };

    // Save Person in the database
    Person.create(person)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        if (err instanceof db.Sequelize.UniqueConstraintError) {
            return res.status(400).send(LOGIN_ALREADY_LINKED);
        }
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Person."
        });
    });
};

// Retrieve all Persons from the database.
exports.findAll = (req, res) => {
    Person.findAll()

    .then(data => {

        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Person."
        });
    });
    
};

// Find a single Person with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Person.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Person with id=" + id
        });
    });
};

// Update a Person by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    const changes = { ...req.body };
    if ("user_name" in changes) {
        changes.user_name = normalizeUserName(changes.user_name);
    }

    Person.update(changes, {
        where: {
            per_ID: id
        }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Person was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Person with id=${id}. Maybe Person was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        if (err instanceof db.Sequelize.UniqueConstraintError) {
            return res.status(400).send(LOGIN_ALREADY_LINKED);
        }
        res.status(500).send({
            message: "Error updating Person with id=" + id
        });
    });
};

// Delete a Group Member with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    // Remove everything that points at this person, then the person
    db.sequelize.transaction(transaction => {
        const byPerson = { where: { per_ID: id }, transaction };

        return db.personcontact.findAll(byPerson)
        .then(contacts => {
            const com_IDs = contacts.map(contact => contact.com_ID).filter(com_ID => com_ID != null);
            return db.personcontact.destroy(byPerson)
            .then(() => db.communication.destroy({ where: { com_ID: com_IDs }, transaction }));
        })
        .then(() => db.familyperson.destroy(byPerson))
        .then(() => db.groupmember.destroy(byPerson))
        .then(() => db.attendee.destroy(byPerson))
        .then(() => db.lifeventperson.destroy(byPerson))
        // Families and groups this person headed or led no longer have one
        .then(() => db.family.update({ per_ID: null }, byPerson))
        .then(() => db.group.update({ per_ID: null }, byPerson))
        .then(() => Person.destroy(byPerson));
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Person was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete member with id=${id}. Maybe member was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete member with id=" + id
        });
    });
};