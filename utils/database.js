const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "random123", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
