const { Sequelize } = require('sequelize');
const User = require('./models/user');
const LinkedAccount = require('./models/linkedAccount');
const Transaction = require('./models/transaction');

const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres' });

sequelize.sync();
