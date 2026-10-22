const test = require("node:test");
const assert = require("node:assert");
const { scrub } = require("../middleware/contactPrivacy");

// A regular user who may see person 1, family 10 and contact 100
const access = { people: new Set([1]), families: new Set([10]), contacts: new Set([100]) };

const person = (per_ID) => ({ per_ID, frst_name: "A", last_name: "B", email: "e", phone: "p", address: "a", notes: "n" });

test("hides other people's contact details and everyone's notes", () => {
  const body = [person(1), person(2)];
  scrub(body, access);
  assert.deepStrictEqual(body[0], { per_ID: 1, frst_name: "A", last_name: "B", email: "e", phone: "p", address: "a" });
  assert.deepStrictEqual(body[1], { per_ID: 2, frst_name: "A", last_name: "B" });
});

test("filters people and families nested in other records", () => {
  const family = (fam_ID) => ({ fam_ID, fam_name: "F", per_ID: 2, fam_email: "e", fam_phone: "p", fam_address: "a" });
  const body = [
    { fp_ID: 1, fam_ID: 10, per_ID: 2, person: person(2), family: family(10) },
    { fp_ID: 2, fam_ID: 11, per_ID: 2, person: person(2), family: family(11) },
  ];
  scrub(body, access);
  assert.strictEqual(body[0].person.email, undefined);
  assert.strictEqual(body[0].family.fam_email, "e");
  assert.deepStrictEqual(body[1].family, { fam_ID: 11, fam_name: "F", per_ID: 2 });
});

test("hides contact records that aren't the user's to see", () => {
  const body = [
    { cpc_ID: 1, com_ID: 100, per_ID: 1, communication: { com_ID: 100, address: "x", number: "1" } },
    { cpc_ID: 2, com_ID: 200, per_ID: 2, communication: { com_ID: 200, address: "y", number: "2" } },
  ];
  scrub(body, access);
  assert.strictEqual(body[0].communication.number, "1");
  assert.deepStrictEqual(body[1].communication, { com_ID: 200 });
});
