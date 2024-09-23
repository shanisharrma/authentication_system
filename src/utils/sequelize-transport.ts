import TransportStream, { TransportStreamOptions } from 'winston-transport';
import { Log } from '../database'; // Sequelize model for logging.
import { LogEntry } from 'winston';

// Custom interface for Sequelize transport options extending Winston's TransportStreamOptions
interface SequelizeTransportOptions extends TransportStreamOptions {
    level: string; // Logging level (e.g., 'info', 'error')
}

// Custom Sequelize transport class extending Winston's TransportStream for logging into the database
class SequelizeTransport extends TransportStream {
    constructor(opts: SequelizeTransportOptions) {
        super(opts);
        this.level = opts.level; // Define the log level from options
    }

    // Override the log method to handle log entries
    log(info: LogEntry, callback: () => void) {
        // Emit the 'logged' event asynchronously after logging
        setImmediate(() => {
            this.emit('logged', info);
        });

        const { level, message, meta = {} } = info; // Extracting log information

        // Store the log into the database using Sequelize
        Log.create({
            level: level,
            message: message,
            meta: JSON.stringify(meta), // Convert meta data to string format for storage
            timestamp: new Date(), // Capture the current timestamp
        });

        // Notify Winston that logging is done
        callback();
    }
}

export default SequelizeTransport;
