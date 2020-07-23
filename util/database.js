const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete','root',process.env.MySQL_Password,{
    dialect : 'mysql',
    host : 'localhost'
});


module.exports = sequelize;