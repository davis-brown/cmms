module.exports = {
    HOST: "REMOVED",
    PORT: 3306,
    USER: "admin",
    PASSWORD: "REMOVED",
    DB: 'congregations',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    }
  };