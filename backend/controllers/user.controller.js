// --- Account management for admins ---

const db = require("../models");
const User = db.user;

const describe = (user, people) => {
  const person = people.find(p => p.user_name && p.user_name.toLowerCase() === user.username.toLowerCase());
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    approved: user.approved,
    roles: user.roles.map(role => role.name),
    member: person ? { per_ID: person.per_ID, name: `${person.frst_name || ""} ${person.last_name || ""}`.trim() } : null
  };
};

// List every account with its roles and linked member, newest first
exports.listUsers = (req, res) => {
  Promise.all([
    User.findAll({ include: [{ model: db.role, attributes: ["name"], through: { attributes: [] } }], order: [["id", "DESC"]] }),
    db.person.findAll({ where: { user_name: { [db.Sequelize.Op.ne]: null } }, attributes: ["per_ID", "frst_name", "last_name", "user_name"] })
  ])
    .then(([users, people]) => res.send(users.map(user => describe(user, people))))
    .catch(err => res.status(500).send({ message: err.message || "Could not load users." }));
};

// Change an account's approval and/or roles: { approved: true, roles: ["user", "leader"] }
exports.updateUser = (req, res) => {
  const id = Number(req.params.id);
  const { approved, roles } = req.body;
  const isSelf = id === Number(req.userId);

  if (approved !== undefined && typeof approved !== "boolean") {
    return res.status(400).send({ message: "approved must be true or false." });
  }
  if (roles !== undefined && (!Array.isArray(roles) || roles.some(role => !db.ROLES.includes(role)))) {
    return res.status(400).send({ message: `roles must be a list drawn from: ${db.ROLES.join(", ")}.` });
  }
  // Stop admins locking themselves out
  if (isSelf && (approved === false || (roles && !roles.includes("admin")))) {
    return res.status(400).send({ message: "You can't remove your own approval or admin role." });
  }

  User.findByPk(id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      return db.sequelize.transaction(transaction => {
        const steps = [];
        if (approved !== undefined) {
          steps.push(user.update({ approved }, { transaction }));
        }
        if (roles !== undefined) {
          steps.push(
            db.role.findAll({ where: { name: roles }, transaction })
              .then(found => user.setRoles(found, { transaction }))
          );
        }
        return Promise.all(steps);
      }).then(() => res.send({ message: "User was updated." }));
    })
    .catch(err => res.status(500).send({ message: err.message || "Could not update user." }));
};

// Delete an account. Its member record is kept but no longer linked to a login.
exports.deleteUser = (req, res) => {
  const id = Number(req.params.id);
  if (id === Number(req.userId)) {
    return res.status(400).send({ message: "You can't delete your own account." });
  }

  User.findByPk(id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      return db.sequelize.transaction(transaction =>
        db.person.update({ user_name: null }, { where: { user_name: user.username }, transaction })
          .then(() => user.setRoles([], { transaction }))
          .then(() => user.destroy({ transaction }))
      ).then(() => res.send({ message: "User was deleted." }));
    })
    .catch(err => res.status(500).send({ message: err.message || "Could not delete user." }));
};
