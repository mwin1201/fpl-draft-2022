const Sequelize = require("sequelize");

let dbConfig;

if (process.env.NODE_ENV === 'production') {
  dbConfig = {
    HOST: process.env.extHOST,
    USER: process.env.extUSER,
    PASSWORD: process.env.extPASSWORD,
    DB: process.env.extDB,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
} else {
  dbConfig = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "AnewSQLsoftware#101",
    DB: "fpl_test_db",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
}

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
  }
});

module.exports = sequelize;