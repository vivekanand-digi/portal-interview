
"use strict";

const winston = require('winston');

const winstonConsoleLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
const myFormat = winston.format.printf(info => {
    return `${new Date()} - ${info.level}  : ${info.message}`
  }

  );

const transportConsole = new winston.transports.Console({
  json: false,
  timestamp: () => new Date(),
  prettyPrint(object) {
    object && delete object.password;
    _.omit(object, ['password']);
    _.omit(object, ['file']);
    return JSON.stringify(object);
  },
  colorize: true,
  level: winstonConsoleLevel,
  format: winston.format.combine(
    winston.format.colorize(),
    myFormat,
    winston.format.colorize()
  )
});


const logger = winston.createLogger({
  format: winston.format.timestamp(),
  levels: {
    debug: 6,
    info: 5,
    warn: 4,
    error: 3,
    verbose: 2,
    i: 1,
    db: 0,
  },
  transports: [
    transportConsole,
  ],
  exitOnError: false,
});

winston.addColors({
  debug: 'yellow',
  info: 'blue',
  warn: 'cyan',
  error: 'red',
  verbose: 'green',
  i: 'gray',
  db: 'magenta',
});

module.exports = logger;