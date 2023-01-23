const {createLogger, format, transports, config} = require("winston");

const options = {
    file: {
        level: "info",
        filename: "./logs/app.log",
        handleException: true,
        json: true,
        maxsize: 5242880, //5MB
        maxFiles: 5,
        colorsize: false,
        timestamp:true
    },
    console: {
        level: "debug",
        handleException: true,
        json: true,
        colorsize: true
    },
};

const logger = createLogger({
    levels: config.npm.levels,
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),
    transports: [
        new transports.File(options.file),
        new transports.Console(options.console)
    ],
    exitOnError: false
})

module.exports = logger