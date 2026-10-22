const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database. New users always get the "user" role; roles sent
  // in the request are ignored so callers can't grant themselves admin.
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  })
    .then(user => {
      return Role.findOne({ where: { name: "user" } }).then(role => {
        return user.setRoles([role]);
      });
    })
    .then(() => {
      res.send({ message: "Registered! An admin needs to approve your account before you can log in." });
    })
    .catch(err => {
      // Two sign-ups racing for the same name get past the duplicate check;
      // the unique index stops the second one
      if (err instanceof db.Sequelize.UniqueConstraintError) {
        return res.status(400).send({ message: "Failed! Username is already in use!" });
      }
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      // Same answer for an unknown username and a wrong password, so the
      // response doesn't reveal which usernames exist
      if (!user || !bcrypt.compareSync(String(req.body.password || ""), user.password)) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid username or password."
        });
      }

      if (!user.approved) {
        return res.status(403).send({
          accessToken: null,
          message: "Your account is waiting for an admin to approve it."
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      return Promise.all([
        user.getRoles(),
        // The member record linked to this login, if an admin has set one up
        db.person.findOne({ where: { user_name: user.username } })
      ]).then(([roles, person]) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          per_ID: person ? person.per_ID : null,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};