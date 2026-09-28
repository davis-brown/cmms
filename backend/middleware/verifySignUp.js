const db = require("../models");
const User = db.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "Username, email and password are required!"
    });
  }

  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }

    // Email
    return User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  }).catch(err => {
    res.status(500).send({
      message: "Unable to validate sign up!"
    });
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;
