// Database settings come from environment variables (see .env.example).
// The defaults match a stock local MySQL install.
module.exports = {
  HOST: process.env.DB_HOST || 'localhost',
  PORT: Number(process.env.DB_PORT) || 3306,
  USER: process.env.DB_USER || 'root',
  PASSWORD: process.env.DB_PASSWORD || '',
  DB: process.env.DB_NAME || 'congregations',
  dialect: 'mysql',
  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
  },
};
