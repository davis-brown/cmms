const db = require("../models");
const Family = db.family;
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')
const path = require('path')

const IMAGES_DIR = path.join(__dirname, '../public/images');
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Delete a picture from the images folder. Only the file name is used, so the
// caller can't escape the folder with paths like "../../server.js".
const removePicture = (pic) => {
    const fileName = path.basename(String(pic));
    fs.unlink(path.join(IMAGES_DIR, fileName), (err) => {
        if (err) {
          console.error(err)
        }
    })
};


// Create and Save a new Family
exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can NOT be empty!"
        });
        return;
    }

    // Create a Family
    const family = {
        fam_ID: req.body.fam_ID,
        fam_pic: req.body.fam_pic,
        fam_name: req.body.fam_name,
        per_ID: req.body.per_ID,
        fam_email: req.body.fam_email,
        fam_phone: req.body.fam_phone,
        fam_address: req.body.fam_address,
    };

    // Save Family in the database
    console.log(family);
    Family.create(family)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Family."
        });
    });
};

exports.upload = (req, res) => {
    const oldPic = req.body.existingPic;

    if (!req.files || !req.files.file || Array.isArray(req.files.file)) {
        return res.status(400).send({ msg: "file is not found" })
    }

    const myFile = req.files.file;
    const extension = path.extname(myFile.name).toLowerCase();

    if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension) || !myFile.mimetype.startsWith('image/')) {
        return res.status(400).send({ msg: "Only image files are allowed" })
    }

    myFile.name = uuidv4() + extension;

    myFile.mv(path.join(IMAGES_DIR, myFile.name), function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        if (oldPic) {
            removePicture(oldPic);
        }
        return res.send({name: myFile.name, path: `/${myFile.name}`});
    });
};
// Retrieve all Familys from the database.
exports.findAll = (req, res) => {

    Family.findAll()
    
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Familys."
        });
    });
    
};

// Find a single Family with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Family.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Family with id=" + id
        });
    });
};

// Update a Family by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Family.update(req.body, {
        where: {
            fam_ID: id
        }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Family was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Family with id=${id}. Maybe Family was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Family with id=" + id
        });
    });
};

// Delete a Family with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Family.findByPk(id)
    .then(family => {
        return Family.destroy({
            where: {
                fam_ID: id
            }
        })
        .then(num => {
            if (num == 1) {
                if (family && family.fam_pic) {
                    removePicture(family.fam_pic);
                }
                res.send({
                    message: "Family was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Family with id=${id}. Maybe Family was not found!`
                });
            }
        });
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Family with id=" + id
        });
    });
};

// Delete all Familys from the database.
exports.deleteAll = (req, res) => {
    Family.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({
            message: `${nums} Families were deleted successfully!`
        });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all Familys."
        });
    });
};