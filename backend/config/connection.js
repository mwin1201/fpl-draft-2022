const Sequelize = require("sequelize");

let dbConfig,sequelize;

if (process.env.NODE_ENV === 'production') {
  dbConfig = {
    HOST: process.env.intHOST,
    USER: process.env.intUSER,
    PASSWORD: process.env.intPASSWORD,
    DB: process.env.intDB,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };

  // sequelize = new Sequelize(`${process.env.DB_URI_INTERNAL}`, {
  //   dialect: "postgres",
  //   dialectOptions: {
  //     ssl: true
  //   }
  // });

  sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    dialectOptions: {
      ssl: true
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
  });

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

  sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
  });

};

sequelize.authenticate().then(() => console.log('connection established successfully!')).catch(err => console.log(err));

module.exports = sequelize;