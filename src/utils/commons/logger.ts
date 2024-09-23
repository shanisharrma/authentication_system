import { createLogger, format, transports } from 'winston'; // Importing winston for logging.
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports'; // Transport interfaces for console and file logging.
import util from 'util';
import { ServerConfig } from '../../config'; // Importing server configuration.
import { EApplicationEnvironment, ELogLevel } from '../constants'; // Importing application constants.
import path from 'path'; // For handling file paths.
import { red, blue, green, yellow, magenta } from 'colorette'; // For colorful console output.
import * as sourceMapSupport from 'source-map-support'; // For enhanced stack traces.
import SequelizeTransport from '../sequelize-transport'; // Custom transport for logging to a database.

// Linking TypeScript Compiler Trace Support
sourceMapSupport.install();

// Function to colorize log levels
const colorizeLevel = (level: string) => {
    switch (level) {
        case ELogLevel.INFO:
            return blue(level);
        case ELogLevel.ERROR:
            return red(level);
        case ELogLevel.WARN:
            return yellow(level);
        default:
            return level; // Return level as is if no match.
    }
};

// Format for console logs
const consoleLogFormat = format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info;

    const customLevel = colorizeLevel(level.toUpperCase());
    const customMessage = message;
    const customTimeStamp = green(timestamp);
    const customMeta = util.inspect(meta, {
        showHidden: false,
        depth: null,
        colors: true,
    });

    // Custom log structure for console output
    const customLog = `${customLevel} [${customTimeStamp}] ${customMessage}\n${magenta(ELogLevel.META)} ${customMeta}`;
    return customLog;
});

// Transport for console logging (only in development)
const consoleTransport = (): Array<ConsoleTransportInstance> => {
    if (ServerConfig.ENV === EApplicationEnvironment.DEVELOPMENT) {
        return [
            new transports.Console({
                level: 'info',
                format: format.combine(format.timestamp(), consoleLogFormat), // Combining timestamp and custom format.
            }),
        ];
    }
    return []; // No console transport in production.
};

// Format for file logs
const fileLogFormat = format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info;

    const logMeta: Record<string, unknown> = {};

    // Process meta information for error logging
    for (const [key, value] of Object.entries(meta)) {
        if (value instanceof Error) {
            logMeta[key] = {
                name: value.name,
                message: value.message,
                trace: value.stack,
            };
        }
        logMeta[key] = value; // Store other metadata as is.
    }

    // Structure for file log data
    const logData = {
        level: level.toUpperCase(),
        message,
        timestamp,
        meta: logMeta,
    };

    return JSON.stringify(logData, null, 4); // Format log data as JSON.
});

// Transport for file logging
const fileTransport = (): Array<FileTransportInstance> => {
    return [
        new transports.File({
            level: 'info',
            filename: path.join(__dirname, '../', '../', '../', 'logs', `${ServerConfig.ENV}.log`), // Dynamic log file path based on environment.
            format: format.combine(format.timestamp(), fileLogFormat), // Combine timestamp and file log format.
        }),
    ];
};

// Custom Sequelize transport for logging into the database
const sequelizeTransport = (): SequelizeTransport[] => {
    return [
        new SequelizeTransport({
            level: 'info', // Set logging level for Sequelize transport.
        }),
    ];
};

// Creating the logger with defined transports
export default createLogger({
    defaultMeta: {
        meta: {}, // Default metadata to be included in all logs.
    },
    transports: [...fileTransport(), ...consoleTransport(), ...sequelizeTransport()], // Combining all transports.
});
