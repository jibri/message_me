var fs = require('fs');

// Log levels
var LOG_LEVELS = { INFO : { value : 3,
                           name : 'INFO' },
                  DEBUG : { value : 2,
                           name : 'DEBUG' },
                  ERROR : { value : 1,
                           name : 'ERROR' },
                  NONE : { value : 0,
                          name : 'NONE' } };

// Default log level
var LOG_LEVEL = LOG_LEVELS.DEBUG;

// Default log file path
var FILE_PATH = './';

// Base of log file name
var FILE_NAME = 'Log.log';

var NEW_LINE = '\n';

// Exports functionss
module.exports.LOG_LEVELS = LOG_LEVELS;
module.exports.setLogFilePath = setLogFilePath;
module.exports.setLogLevel = setLogLevel;
module.exports.logInfo = logInfo;
module.exports.logDebug = logDebug;
module.exports.logError = logError;

/**
 * Set the log level.
 * 
 * Authorized values (first ones includ later ones): 'INFO', 'DEBUG', 'ERROR', 'NONE'
 * 
 * @param level
 *          A string among the authoized ones, or a value from the LOG_LEVELS enum
 */
function setLogLevel(level) {

  if (typeof level === 'string') {
    level = LOG_LEVELS[level];
  }

  if (level) {
    LOG_LEVEL = level;
  }
}

/**
 * Set the path of the log file. Must end with '/'
 * 
 * @param path
 *          The new path
 */
function setLogFilePath(path) {

  FILE_PATH = path;
}

/**
 * True if the given level is enabled to be written or not
 * 
 * @param level
 *          The log level to check as a value from the LOG_LEVELS enum
 */
function isLevelEnabled(level) {

  return LOG_LEVEL != LOG_LEVELS.NONE && LOG_LEVEL.value >= level.value;
}

/**
 * Log the given message as an INFO log.
 * 
 * @param message
 */
function logInfo(message) {

  log(message, LOG_LEVELS.INFO);
}

/**
 * Log the given message as a DEBUG log.
 * 
 * @param message
 */
function logDebug(message) {

  log(message, LOG_LEVELS.DEBUG);
}

/**
 * Log the given message as an ERROR log.
 * 
 * @param message
 */
function logError(message) {

  log(message, LOG_LEVELS.ERROR);
}

/**
 * Log the given message with the given log level. The log is written into a file and the console.
 * 
 * To set the filePath, use setLogFilePath, and to set accepted log level, use setLogLevel
 * 
 * @param message
 * @param level
 */
function log(message, level) {

  if (isLevelEnabled(level)) {

    var now = new Date();
    var filePath = FILE_PATH + dateToString(now) + '_' + FILE_NAME;
    message = '[' + level.name + '] ' + dateToString(now, true) + ' ' + message;

    var file = fs.appendFile(filePath, NEW_LINE + message, function(err) {

      if (err) {
        console.log('An error occured while write log file. The message will not be recorded. ' + err);
      }

      if (level === LOG_LEVELS.ERROR) {
        console.error(message);
      } else {
        console.log(message);
      }
    });
  }
}

function dateToString(date, hasTime) {

  var string = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

  if (hasTime) {
    string += ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }
  return string;

}