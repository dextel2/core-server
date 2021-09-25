const Sequelize = require("sequelize");
const dbConfig = require("./db.config");
const sequelize = new Sequelize(dbConfig.DB_NAME, dbConfig.USERNAME, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.DIALECT,
});

module.exports = sequelize;
