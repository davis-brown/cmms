const test = require("node:test");
const assert = require("node:assert");
const db = require("../models");
const { create } = require("../controllers/attendee.controller");

// Stub the models so no database is needed; returns the attendee.create calls
const stub = ({ event, person, existing = null }) => {
  const created = [];
  db.user.findByPk = async () => ({ username: "alice" });
  db.event.findByPk = async () => event;
  db.person.findOne = async ({ where }) => (where.user_name === "alice" ? person : null);
  db.attendee.findOne = async () => existing;
  db.attendee.create = async (row) => { created.push(row); return row; };
  db.attendee.count = async () => 1;
  db.event.update = async () => [1];
  return created;
};

// Calls create and resolves once a response is sent
const call = (body) => new Promise((resolve) => {
  const res = { statusCode: 200 };
  res.status = (code) => { res.statusCode = code; return res; };
  res.send = (data) => resolve({ status: res.statusCode, data });
  create({ userId: 1, body }, res);
});

test("an RSVP to a missing event gets 404 and creates nothing", async () => {
  const created = stub({ event: null, person: { per_ID: 7 } });
  const { status, data } = await call({ evt_ID: 999999, per_ID: 7 });
  assert.strictEqual(status, 404);
  assert.deepStrictEqual(data, { message: "Event not found." });
  assert.strictEqual(created.length, 0);
});

test("a new RSVP stores the caller's own per_ID, not the body's", async () => {
  const created = stub({ event: { evt_ID: 5 }, person: { per_ID: 7 } });
  const { status } = await call({ evt_ID: 5, per_ID: 42, contribution: "pie" });
  assert.strictEqual(status, 200);
  assert.deepStrictEqual(created, [{ evt_ID: 5, per_ID: 7, username: "alice", contribution: "pie" }]);
});

test("a login with no linked member stores per_ID null", async () => {
  const created = stub({ event: { evt_ID: 5 }, person: null });
  await call({ evt_ID: 5, per_ID: 42 });
  assert.strictEqual(created[0].per_ID, null);
});

test("updating an RSVP relinks it to the caller's own per_ID", async () => {
  const updates = [];
  const existing = { evt_ID: 5, per_ID: 42, update: async (fields) => { updates.push(fields); return existing; } };
  const created = stub({ event: { evt_ID: 5 }, person: { per_ID: 7 }, existing });
  const { status } = await call({ evt_ID: 5, per_ID: 42, contribution: "cake" });
  assert.strictEqual(status, 200);
  assert.strictEqual(created.length, 0);
  assert.deepStrictEqual(updates, [{ per_ID: 7, contribution: "cake" }]);
});

test("a malformed evt_ID gets 400 and creates nothing", async () => {
  for (const evt_ID of [undefined, [5, 6], { id: 5 }, "abc", 0, -1, 1.5]) {
    const created = stub({ event: { evt_ID: 5 }, person: { per_ID: 7 } });
    const { status } = await call({ evt_ID });
    assert.strictEqual(status, 400, `evt_ID ${JSON.stringify(evt_ID)}`);
    assert.strictEqual(created.length, 0);
  }
});

test("a numeric-string evt_ID is stored as a number", async () => {
  const created = stub({ event: { evt_ID: 5 }, person: { per_ID: 7 } });
  await call({ evt_ID: "5" });
  assert.strictEqual(created[0].evt_ID, 5);
});
