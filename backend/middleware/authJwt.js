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

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;
