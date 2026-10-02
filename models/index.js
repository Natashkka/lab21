const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false
});

const RequestLog = require('./RequestLog')(sequelize);

module.exports = {
    sequelize,
    RequestLog
};