var fs = require('fs');

var globalFilePath;
var globalLevel;

module.exports.Logger = Logger;

function Logger() {

  this.filePath = this.setFilePath(globalFilePath);
  this.logLevel = this.setLogLevel(globalLevel);

  // Base of log file name
  this.NO_LOG_FILE = 'NO_LOG';
  // Base of log file name
  this.FILE_NAME = 'Log.log';
  // New line char
  this.NEW_LINE = '\n';
  // Log levels enum
  this.LOG_LEVELS = { INFO : { value : 3,
                              name : 'INFO' },
                     DEBUG : { value : 2,
                              name : 'DEBUG' },
                     ERROR : { value : 1,
                              name : 'ERROR' },
                     NONE : { value : 0,
                             name : 'NONE' } };
}

/**
 * Set the log level.
 * 
 * Authorized values (first ones includ later ones): 'INFO', 'DEBUG', 'ERROR', 'NONE'
 * 
 * @param level
 *          A string among the authoized ones, or a value from the LOG_LEVELS enum
 */
Logger.prototype.setLogLevel = function setLogLevel(level) {

  if (typeof level === 'string') {
    globalLevel = this.LOG_LEVELS[level];
  } else {
    globalLevel = level;
  }

  this.logLevel = globalLevel;
};

/**
 * Set the path of the log file. Must end with '/'
 * 
 * @param path
 *          The new path
 */
Logger.prototype.setFilePath = function setLogFilePath(path) {

  globalFilePath = path ? path : this.NO_LOG_FILE;
  this.filePath = globalFilePath;
};

/**
 * True if the given level is enabled to be written or not
 * 
 * @param level
 *          The log level to check as a value from the LOG_LEVELS enum
 */
Logger.prototype.isLevelEnabled = function isLevelEnabled(level) {

  return this.logLevel != this.LOG_LEVELS.NONE && this.logLevel.value >= level.value;
};

/**
 * Log the given message as an INFO log.
 * 
 * @param message
 */
Logger.prototype.logInfo = function logInfo(message) {

  this.log(message, this.LOG_LEVELS.INFO);
};

/**
 * Log the given message as a DEBUG log.
 * 
 * @param message
 */
Logger.prototype.logDebug = function logDebug(message) {

  this.log(message, this.LOG_LEVELS.DEBUG);
};

/**
 * Log the given message as an ERROR log.
 * 
 * @param message
 */
Logger.prototype.logError = function logError(message) {

  this.log(message, this.LOG_LEVELS.ERROR);
};

/**
 * Log the given message with the given log level. The log is written into a file and the console.
 * 
 * To set the filePath, use setLogFilePath, and to set accepted log level, use setLogLevel
 * 
 * @param message
 * @param level
 */
Logger.prototype.log = function log(message, level) {

  if (this.isLevelEnabled(level)) {

    var now = new Date();
    var logMessage = '[' + level.name + '] ' + dateToString(now, true) + ' ' + message;

    if (this.filePath !== this.NO_LOG_FILE) {
      var path = this.filePath + dateToString(now) + '_' + this.FILE_NAME;

      fs.appendFile(path, this.NEW_LINE + logMessage, function(err) {

        if (err) {
          console.log('An error occured while write log file. The message will not be recorded. ' + err);
        }
      });
    }

    if (level === this.LOG_LEVELS.ERROR) {
      console.error(logMessage);
    } else {
      console.log(logMessage);
    }
  }
};

function dateToString(date, hasTime) {

  var string = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

  if (hasTime) {
    string += ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }
  return string;

}