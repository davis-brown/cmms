const db = require("./models");

// RSVPs used to take per_ID from the client, so some point at the wrong member
// and would be deleted with them. Relink each to its user's own member record.
module.exports = async function repairAttendeePerIds() {
  const [result] = await db.sequelize.query(
    `UPDATE attendee a LEFT JOIN person p ON p.user_name = a.username
     SET a.per_ID = p.per_ID
     WHERE a.username IS NOT NULL AND NOT (a.per_ID <=> p.per_ID)`
  );
  if (result.affectedRows) console.log(`Relinked ${result.affectedRows} RSVP(s) to their user's member record.`);
};
