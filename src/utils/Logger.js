class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance; // Singleton pattern
        }

        this.logLevel = 'info'; // Default log level
        this.logLevels = ['debug', 'info', 'warn', 'error']; // Log level hierarchy
        Logger.instance = this;

        // Color map for log levels
        this.colorMap = {
            debug: '\x1b[36m', // Cyan
            info: '\x1b[32m',  // Green
            warn: '\x1b[33m',  // Yellow
            error: '\x1b[31m', // Red
            reset: '\x1b[0m'   // Reset color
        };

    }

    setLogLevel(level) {
        if (this.logLevels.includes(level)) {
            this.logLevel = level;
        } else {
            console.warn(`Invalid log level: ${level}`);
        }
    }

    log(level, message, meta = {}) {
        if (this.logLevels.indexOf(level) >= this.logLevels.indexOf(this.logLevel)) {
            const color = this.colorMap[level] || this.colorMap.reset;

            const formattedMessage = `${color}[${level.toUpperCase()}] ${message}${this.colorMap.reset}`;

            if (Object.keys(meta).length > 0) {
                console.log(`${formattedMessage}\n${color}↳ meta: ${typeof meta}`, `${JSON.stringify(meta, null, 2)}${this.colorMap.reset}`);
            } else {
                console.log(formattedMessage);
            }
        }
    }

    debug(message, meta = {}) {
        this.log('debug', message, meta);
    }

    info(message, meta = {}) {
        this.log('info', message, meta);
    }

    warn(message, meta = {}) {
        this.log('warn', message, meta);
    }

    error(message, meta = {}) {
        if (message instanceof Error) {
            this.log(message);
            this.log(meta);
        } else {
            this.log('error', message, meta);
        }
    }
}

module.exports = Logger;