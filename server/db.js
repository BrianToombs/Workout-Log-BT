const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:Groovy1971@localhost:5432/workout-log");

module.exports = sequelize;