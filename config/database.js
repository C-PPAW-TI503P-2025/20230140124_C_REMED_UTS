const { Sequelize } = require('sequelize');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize(
  isTest ? 'sqlite::memory:' : process.env.DB_NAME,
  isTest ? null : process.env.DB_USER,
  isTest ? null : process.env.DB_PASSWORD,
  {
    host: isTest ? null : process.env.DB_HOST,
    dialect: isTest ? 'sqlite' : 'mysql',
    logging: false
  }
);

module.exports = sequelize;
