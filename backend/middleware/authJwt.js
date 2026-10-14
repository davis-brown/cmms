const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, { algorithms: ["HS256"] }, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

// Returns middleware that allows the request if the user has any of the given roles
const requireRole = (roleNames, message) => (req, res, next) => {
  User.findByPk(req.userId)
    .then(user => {
      if (!user) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }

      return user.getRoles().then(roles => {
        if (roles.some(role => roleNames.includes(role.name))) {
          return next();
        }

        res.status(403).send({ message });
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Unable to validate user role!"
      });
    });
};

const isAdmin = requireRole(["admin"], "Require Admin Role!");
const isModerator = requireRole(["moderator"], "Require Moderator Role!");
const isModeratorOrAdmin = requireRole(["moderator", "admin"], "Require Moderator or Admin Role!");

// Returns middleware that lets moderators and admins through, plus users whose
// member record (person.user_name = their username) belongs to the family.
// getFamId(req) returns the family's id, or a promise of it.
const isFamilyMemberOrModerator = getFamId => (req, res, next) => {
  const forbidden = () => res.status(403).send({
    message: "You can only edit your own family!"
  });

  User.findByPk(req.userId)
    .then(user => {
      if (!user) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }

      return user.getRoles().then(roles => {
        if (roles.some(role => ["moderator", "admin"].includes(role.name))) {
          return next();
        }

        return Promise.all([
          Promise.resolve(getFamId(req)),
          db.person.findOne({ where: { user_name: user.username } })
        ]).then(([fam_ID, person]) => {
          if (!fam_ID || !person) {
            return forbidden();
          }

          return db.familyperson.findOne({
            where: { fam_ID: String(fam_ID), per_ID: person.per_ID }
          }).then(membership => (membership ? next() : forbidden()));
        });
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Unable to validate family access!"
      });
    });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
  isFamilyMemberOrModerator: isFamilyMemberOrModerator
};
module.exports = authJwt;
