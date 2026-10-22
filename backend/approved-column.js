const db = require("./models");

// sequelize.sync() only creates missing tables, so databases from before
// sign-up approval existed need the users.approved column added. Accounts
// that already exist are approved so nobody is locked out by the upgrade.
module.exports = async function ensureApprovedColumn() {
  const queryInterface = db.sequelize.getQueryInterface();
  const columns = await queryInterface.describeTable("users");
  if (columns.approved) return;

  await queryInterface.addColumn("users", "approved", {
    type: db.Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
  const [result] = await db.sequelize.query("UPDATE users SET approved = TRUE");
  console.log(`Added users.approved; approved ${result.affectedRows} existing account(s).`);
};
