const db = require("./models");

// Columns that must never hold the same value twice. The models declare them
// unique, but sequelize.sync() only does that for tables it creates, so this
// adds the index to databases that already existed.
const UNIQUE_COLUMNS = [
  { table: "users", column: "username" },
  { table: "person", column: "user_name" },
];

async function ensureUniqueIndex({ table, column }) {
  const queryInterface = db.sequelize.getQueryInterface();

  const indexes = await queryInterface.showIndex(table);
  const hasIndex = indexes.some(
    (index) => index.unique && index.fields.length === 1 && index.fields[0].attribute === column
  );
  if (hasIndex) return;

  // The index can't be created while duplicates exist; say which ones so they can be fixed
  const [duplicates] = await db.sequelize.query(
    `SELECT \`${column}\` AS value, COUNT(*) AS count FROM \`${table}\`
     WHERE \`${column}\` IS NOT NULL GROUP BY \`${column}\` HAVING COUNT(*) > 1`
  );
  if (duplicates.length > 0) {
    const list = duplicates.map((d) => `"${d.value}" (${d.count}x)`).join(", ");
    console.warn(
      `Cannot make ${table}.${column} unique until these duplicates are fixed: ${list}`
    );
    return;
  }

  await queryInterface.addIndex(table, {
    fields: [column],
    unique: true,
    name: `${table}_${column}_unique`,
  });
  console.log(`Added unique index on ${table}.${column}.`);
}

module.exports = async function ensureUniqueIndexes() {
  for (const target of UNIQUE_COLUMNS) {
    await ensureUniqueIndex(target);
  }
};
