const test = require("node:test");
const assert = require("node:assert");
const db = require("../models");
const ensureUniqueIndexes = require("../unique-indexes");

// Needs a real MySQL; CI provides one, so it is skipped unless DB_HOST is set.
// It rewrites the users table, so point DB_NAME at a throwaway database.
test("adds the email index to an existing users table", { skip: !process.env.DB_HOST && "DB_HOST not set" }, async (t) => {
  t.after(() => db.sequelize.close());
  await db.sequelize.sync();
  await db.user.destroy({ where: {} });

  // Recreate a database from before email was unique
  const queryInterface = db.sequelize.getQueryInterface();
  for (const index of await queryInterface.showIndex("users")) {
    if (index.unique && !index.primary && index.fields.some((f) => f.attribute === "email")) {
      await queryInterface.removeIndex("users", index.name);
    }
  }

  await ensureUniqueIndexes();

  await db.user.create({ username: "first", email: "same@example.com", password: "p" });
  await assert.rejects(
    db.user.create({ username: "second", email: "same@example.com", password: "p" }),
    db.Sequelize.UniqueConstraintError
  );
});
