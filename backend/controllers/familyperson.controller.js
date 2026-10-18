const db = require("../models");
const Familyperson = db.familyperson;

// Create and Save a new Familyperson
exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can NOT be empty!"
        });
        return;
    }

    // Create a Familyperson
    const familyperson = {
        fp_ID: req.body.fp_ID,
        fam_ID: req.body.fam_ID,
        per_ID: req.body.per_ID,
        fam_role: req.body.fam_role
    };

    // Save Familyperson in the database
    Familyperson.create(familyperson)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Familyperson."
        });
    });
};

// Retrieve all Familypersons from the database.
exports.findPeopleForFamily = (req, res) => {
    const fam_ID = req.query.family;

    var condition = fam_ID ? { fam_ID: String(fam_ID) } : null;

    Familyperson.findAll({include:["person", "family"], where: condition })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Familypersons."
        });
    });
    
};

// Find a single Familyperson with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Familyperson.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Familyperson with id=" + id
        });
    });
};

// Update a Familyperson by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Familyperson.update(req.body, {
        where: {
            fp_ID: id
        }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Familyperson was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Familyperson with id=${id}. Maybe Familyperson was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Familyperson with id=" + id
        });
    });
};

// Delete a Familyperson with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Familyperson.destroy({
        where: {
            fp_ID: id
        }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Familyperson was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Familyperson with id=${id}. Maybe Familyperson was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Familyperson with id=" + id
        });
    });
};

// Delete all Familypersons from the database.
exports.deleteAll = (req, res) => {
    const id = req.query.family;
    if (!id) {
        return res.status(400).send({ message: "The family query parameter is required." });
    }

    Familyperson.destroy({
        where: {fam_ID: String(id)},
        truncate: false
    })
    .then(nums => {
        res.send({
            message: `${nums} Familypersons were deleted successfully!`
        });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all Familypersons."
        });
    });
};