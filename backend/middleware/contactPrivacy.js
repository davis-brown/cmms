const db = require("../models");

// Contact fields regular users may only see for themselves and their own family.
// Leaders also see them for members of the groups they lead (group.per_ID).
// Moderators and admins see everything.
const PERSON_FIELDS = ["email", "phone", "address"];
// Fields only moderators and admins may see, on anyone's record
const STAFF_ONLY_PERSON_FIELDS = ["notes"];
const FAMILY_FIELDS = ["fam_email", "fam_phone", "fam_address"];
const COMMUNICATION_FIELDS = ["address", "number"];

const has = (obj, keys) => keys.some(key => key in obj);

// Works out which members, families and contact records the user may see.
// Returns null for moderators and admins, meaning no filtering.
const loadAccess = userId =>
  db.user.findByPk(userId).then(user => {
    const access = { people: new Set(), families: new Set(), contacts: new Set() };
    if (!user) {
      return access;
    }

    return user.getRoles().then(roles => {
      if (roles.some(role => ["moderator", "admin"].includes(role.name))) {
        return null;
      }

      return db.person.findOne({ where: { user_name: user.username } }).then(person => {
        if (!person) {
          return access;
        }
        access.people.add(person.per_ID);

        return db.familyperson.findAll({ where: { per_ID: person.per_ID } })
          .then(memberships => {
            const famIDs = memberships.map(row => row.fam_ID);
            famIDs.forEach(fam_ID => access.families.add(fam_ID));
            return famIDs.length ? db.familyperson.findAll({ where: { fam_ID: famIDs } }) : [];
          })
          .then(relatives => {
            relatives.forEach(row => access.people.add(row.per_ID));
            if (!roles.some(role => role.name === "leader")) {
              return [];
            }
            // Leaders also see the members of the groups they lead
            return db.group.findAll({ where: { per_ID: person.per_ID } }).then(groups =>
              groups.length ? db.groupmember.findAll({ where: { grp_ID: groups.map(group => group.grp_ID) } }) : []
            );
          })
          .then(groupMembers => {
            groupMembers.forEach(row => access.people.add(row.per_ID));
            return db.personcontact.findAll({ where: { per_ID: Array.from(access.people) } });
          })
          .then(contacts => {
            contacts.forEach(row => access.contacts.add(row.com_ID));
            return access;
          });
      });
    });
  });

const strip = (obj, fields) => fields.forEach(field => delete obj[field]);

// Removes contact fields the user may not see, at any depth (includes nest
// people and families inside other records)
const scrub = (value, access) => {
  if (Array.isArray(value)) {
    value.forEach(item => scrub(item, access));
    return;
  }
  if (!value || typeof value !== "object") {
    return;
  }

  if ("per_ID" in value && has(value, ["frst_name", "last_name"])) {
    strip(value, STAFF_ONLY_PERSON_FIELDS);
    if (!access.people.has(value.per_ID)) {
      strip(value, PERSON_FIELDS);
    }
  }
  if ("fam_ID" in value && "fam_name" in value && !access.families.has(value.fam_ID)) {
    strip(value, FAMILY_FIELDS);
  }
  if ("com_ID" in value && has(value, COMMUNICATION_FIELDS) && !access.contacts.has(value.com_ID)) {
    strip(value, COMMUNICATION_FIELDS);
  }

  Object.values(value).forEach(child => scrub(child, access));
};

// Filters every JSON response sent to a logged-in user. It runs when the
// response is sent, after verifyToken has set req.userId.
const contactPrivacy = (req, res, next) => {
  const json = res.json.bind(res);

  res.json = body => {
    if (!req.userId || !body || typeof body !== "object") {
      return json(body);
    }

    loadAccess(req.userId)
      .then(access => {
        if (!access) {
          return json(body);
        }
        const copy = JSON.parse(JSON.stringify(body));
        scrub(copy, access);
        json(copy);
      })
      .catch(err => {
        // Never fall back to sending the unfiltered data
        res.status(500);
        json({ message: "Unable to check access to contact details!" });
      });
    return res;
  };

  next();
};

module.exports = contactPrivacy;
module.exports.scrub = scrub;
