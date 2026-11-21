const test = require("node:test");
const assert = require("node:assert");
process.env.JWT_SECRET ||= "test"; // auth.config refuses to load without it
const db = require("../models");
const { signup } = require("../controllers/auth.controller");

// Calls signup with User.create rejecting a unique constraint on `fields`
function signupWithDuplicate(t, fields) {
  t.mock.method(db.user, "create", () => Promise.reject(new db.Sequelize.UniqueConstraintError({ fields })));
  return new Promise((resolve) => {
    const res = {
      status(code) { this.code = code; return this; },
      send(body) { resolve({ code: this.code, body }); },
    };
    signup({ body: { username: "u", email: "e", password: "p" } }, res);
  });
}

test("answers the email message when the email index fails", async (t) => {
  assert.deepStrictEqual(await signupWithDuplicate(t, { email: "x" }), { code: 400, body: { message: "Failed! Email is already in use!" } });
  assert.deepStrictEqual(await signupWithDuplicate(t, { "users.users_email_unique": "x" }), { code: 400, body: { message: "Failed! Email is already in use!" } });
});

test("answers the username message when the username index fails", async (t) => {
  assert.deepStrictEqual(await signupWithDuplicate(t, { username: "x" }), { code: 400, body: { message: "Failed! Username is already in use!" } });
});
