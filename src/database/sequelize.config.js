require('ts-node/register');
const { ServerConfig } = require('../config');

module.exports = {
    username: ServerConfig.DB_USER,
    password: ServerConfig.DB_PASS,
    database: ServerConfig.DB_NAME,
    host: ServerConfig.DB_HOST,
    dialect: 'mysql',
};

