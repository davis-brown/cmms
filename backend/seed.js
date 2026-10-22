const bcrypt = require("bcryptjs");
const db = require("./models");

const ROLES = [
  { id: 1, name: "user" },
  { id: 2, name: "moderator" },
  { id: 3, name: "admin" },
  { id: 4, name: "leader" },
];

// Roles are required for sign-up to work, so they are always created.
async function seedRoles() {
  for (const role of ROLES) {
    await db.role.findOrCreate({ where: { id: role.id }, defaults: role });
  }
}

// A demo login with every role, so reviewers can see the whole app.
async function seedDemoUser() {
  const username = process.env.DEMO_USERNAME || "demo";
  const password = process.env.DEMO_PASSWORD || "demo1234";

  const [user, created] = await db.user.findOrCreate({
    where: { username },
    defaults: {
      username,
      email: `${username}@example.com`,
      password: bcrypt.hashSync(password, 10),
      approved: true,
    },
  });
  if (created) {
    await user.setRoles(ROLES.map((r) => r.id));
    console.log(`Created demo user "${username}" / "${password}".`);
  }
}

// Sample members, families, a group and events. Only added to an empty database.
async function seedSampleData() {
  if ((await db.person.count()) > 0) return;

  const people = await db.person.bulkCreate([
    { frst_name: "James", last_name: "Carter", email: "james.carter@example.com", phone: "555-0101", address: "12 Oak St", pub_permission: "Active", church_pos: "Minister", baptised: 1, bday: "1975-04-12" },
    { frst_name: "Mary", last_name: "Carter", email: "mary.carter@example.com", phone: "555-0102", address: "12 Oak St", pub_permission: "Active", church_pos: "Choir Leader", baptised: 1, bday: "1978-09-30" },
    { frst_name: "Ethan", last_name: "Carter", address: "12 Oak St", pub_permission: "Active", church_pos: "VBS Staff", baptised: 0, bday: "2008-06-02" },
    { frst_name: "Linda", last_name: "Nguyen", email: "linda.nguyen@example.com", phone: "555-0110", address: "48 Maple Ave", pub_permission: "Active", church_pos: "Prayer Leader", baptised: 1, bday: "1969-01-21" },
    { frst_name: "Robert", last_name: "Nguyen", email: "robert.nguyen@example.com", phone: "555-0111", address: "48 Maple Ave", pub_permission: "Inactive", church_pos: "Communion Helper", baptised: 1, bday: "1967-11-08" },
    { frst_name: "Grace", last_name: "Okafor", email: "grace.okafor@example.com", phone: "555-0120", address: "7 Elm Ct", pub_permission: "Active", church_pos: "Youth Minister", baptised: 1, bday: "1990-03-15" },
  ]);
  const [james, mary, ethan, linda, robert, grace] = people;

  const carter = await db.family.create({ fam_name: "Carter", per_ID: james.per_ID, fam_email: "carters@example.com", fam_phone: "555-0101", fam_address: "12 Oak St" });
  const nguyen = await db.family.create({ fam_name: "Nguyen", per_ID: linda.per_ID, fam_email: "nguyens@example.com", fam_phone: "555-0110", fam_address: "48 Maple Ave" });

  await db.familyperson.bulkCreate([
    { fam_ID: carter.fam_ID, per_ID: james.per_ID, fam_role: "Primary" },
    { fam_ID: carter.fam_ID, per_ID: mary.per_ID, fam_role: "Spouse" },
    { fam_ID: carter.fam_ID, per_ID: ethan.per_ID, fam_role: "Child" },
    { fam_ID: nguyen.fam_ID, per_ID: linda.per_ID, fam_role: "Primary" },
    { fam_ID: nguyen.fam_ID, per_ID: robert.per_ID, fam_role: "Spouse" },
  ]);

  const choir = await db.group.create({ grp_name: "Choir", per_ID: mary.per_ID });
  const youth = await db.group.create({ grp_name: "Youth Group", per_ID: grace.per_ID });
  await db.groupmember.bulkCreate([
    { grp_ID: choir.grp_ID, per_ID: mary.per_ID, grp_role: "Leader" },
    { grp_ID: choir.grp_ID, per_ID: linda.per_ID, grp_role: "Member" },
    { grp_ID: youth.grp_ID, per_ID: grace.per_ID, grp_role: "Leader" },
    { grp_ID: youth.grp_ID, per_ID: ethan.per_ID, grp_role: "Member" },
  ]);

  // Events are placed relative to today so the calendar always has something to show.
  const daysFromNow = (n) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  await db.event.bulkCreate([
    { event_name: "Sunday Service", event_desc: "Weekly worship service", event_date: daysFromNow(2), event_start: "10:00", event_end: "11:30", loc_ID: "Sanctuary", color: "#1e90ff" },
    { event_name: "Choir Practice", event_desc: "Rehearsal for Sunday", event_date: daysFromNow(4), event_start: "18:30", event_end: "20:00", loc_ID: "Fellowship Hall", color: "#800080" },
    { event_name: "Youth Night", event_desc: "Games and devotional", event_date: daysFromNow(6), event_start: "19:00", event_end: "21:00", loc_ID: "Youth Room", color: "#ffa500" },
  ]);

  console.log("Added sample members, families, groups and events.");
}

module.exports = async function seed() {
  await seedRoles();
  // Opt-in only: the demo user has every role, so never create it on a real server.
  if (process.env.SEED_DEMO_DATA === "true") {
    await seedDemoUser();
    await seedSampleData();
  }
};
