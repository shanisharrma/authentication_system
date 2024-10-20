import { Sequelize } from 'sequelize';
import { ServerConfig } from '../config';
import { Enums } from '../utils/constants';

// Creating a new Sequelize connection instance for MySQL.
const connection: Sequelize = new Sequelize(
    ServerConfig.DB_NAME ?? '', // Database name.
    ServerConfig.DB_USER ?? '', // Database username.
    ServerConfig.DB_PASS ?? '', // Database password.
    {
        host: ServerConfig.DB_HOST ?? '', // Database host.
        dialect: 'mysql', // Database dialect.
        // Disable logging in production; log to console in other environments.
        // eslint-disable-next-line no-console
        logging: ServerConfig.ENV === Enums.EApplicationEnvironment.PRODUCTION ? false : console.log,
    },
);

// Exporting the Sequelize connection for use in other modules.
export default connection;
