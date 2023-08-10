const Sequelize = require("sequelize");

let dbConfig,sequelize;

// connect to the Test Database
if (process.env.DB_INSTANCE === 'development') {

  sequelize = new Sequelize(process.env.DB_URI_TEST_INTERNAL, {
    dialect: "postgres"
  });

} 

// connect to the Production Database
else if (process.env.DB_INSTANCE === 'production') {
  sequelize = new Sequelize(process.env.DB_URI_PROD_INTERNAL, {
    dialect: "postgres"
  });
} 

// connect to the local hosted database
else {

  dbConfig = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "Daniella4",
    DB: "postgres",
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