const winston = require('winston');
const winstonRotator = require('winston-daily-rotate-file');

const { combine, timestamp, printf } = winston.format;
const timestampformat = 'DD-MM-YYYY HH:mm:ss';

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});

const dailyRotateFileTransport = filename => {
  return new winston.transports.DailyRotateFile({
    filename: `log/REST/${filename}/%DATE%-${filename}.log`,
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d'
  });
};

const logger = filename => {
  return winston.createLogger({
    format: combine(
      timestamp({
        format: timestampformat
      }),
      myFormat
    ),
    transports: [dailyRotateFileTransport(filename)]
  });
};

module.exports = logger; // is now a function
