const db = require("./models");

// Columns that must never hold the same value twice. The models declare them
// unique, but sequelize.sync() only does that for tables it creates, so this
// adds the index to databases that already existed.
const UNIQUE_COLUMNS = [
  { table: "users", column: "username" },
  { table: "users", column: "email" },
  { table: "person", column: "user_name" },
];

async function ensureUniqueIndex({ table, column }) {
  const queryInterface = db.sequelize.getQueryInterface();

  const indexes = await queryInterface.showIndex(table);
  const hasIndex = indexes.some(
    (index) => index.unique && index.fields.length === 1 && index.fields[0].attribute === column
  );
  if (hasIndex) return;

  // The index can't be created while duplicates exist. Log only how many, not
  // the values (emails are personal data); the query lists them for an operator.
  const duplicatesQuery = `SELECT \`${column}\`, COUNT(*) FROM \`${table}\`
     WHERE \`${column}\` IS NOT NULL GROUP BY \`${column}\` HAVING COUNT(*) > 1`;
  const [duplicates] = await db.sequelize.query(duplicatesQuery);
  if (duplicates.length > 0) {
    console.warn(
      `Cannot make ${table}.${column} unique until ${duplicates.length} duplicated value(s) are fixed. ` +
        `List them with: ${duplicatesQuery.replace(/\s+/g, " ")}`
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
