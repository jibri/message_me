/**
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE Version 2, December 2004
 * 
 * Copyright (C) 2004 Jeremie Briand <jeremie.briand@outlook.fr>
 * 
 * Everyone is permitted to copy and distribute verbatim or modified copies of
 * this license document, and changing it is allowed as long as the name is
 * changed.
 * 
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE TERMS AND CONDITIONS FOR COPYING,
 * DISTRIBUTION AND MODIFICATION
 * 
 * 0. You just DO WHAT THE FUCK YOU WANT TO.
 */

var fs = require('fs');

// --------------------
// GLOBAL PRIVATE VARIABLES
// --------------------

// The log file path. Set to NO_LOG_FILE to not generate log file
var globalFilePath;

// The log level
var globalLevel;

// Base of log file name
var NO_LOG_FILE = 'NO_LOG';

// Base of log file name
var FILE_NAME = 'Log.log';

// New line char
var NEW_LINE = '\n';

// Static Log levels enum
var LOG_LEVELS = {
	INFO : { value : 3, name : 'INFO' },
	DEBUG : { value : 2, name : 'DEBUG' },
	ERROR : { value : 1, name : 'ERROR' },
	NONE : { value : 0, name : 'NONE' } };

/**
 * Logger constructor
 */
function Logger(name) {

	// ATTRIBUTES
	this.className = name || 'global';

	// METHODS
	this.isLevelEnabled = isLevelEnabled;
	this.logInfo = logInfo;
	this.logDebug = logDebug;
	this.logError = logError;
	this.log = log;
}

// --------------------
// STATIC
// --------------------
Logger.LOG_LEVELS = LOG_LEVELS;
Logger.config = config;

// --------------------
// METHODS
// --------------------

/**
 * Set the log level.
 * 
 * Authorized values (first ones includ later ones): 'INFO', 'DEBUG', 'ERROR',
 * 'NONE'
 * 
 * @param level
 *          A string among the authorized ones, or a value from the LOG_LEVELS
 *          enum
 */
function setLogLevel(level) {

	if (typeof level === 'string') {
		globalLevel = LOG_LEVELS[level];
	} else {
		globalLevel = level;
	}
}

/**
 * Set the path of the log file. Must end with '/'
 * 
 * @param path
 *          The new path
 */
function setFilePath(path) {

	if (path.indexOf(NO_LOG_FILE) !== -1) {
		globalFilePath = NO_LOG_FILE;
	} else {
		globalFilePath = path;
	}
}

/**
 * Static method to config the logger. Uses <code>setLogLevel</code> and
 * <code>setFielPath</code> functions
 * 
 * @param path
 *          The path to the log file
 * @param level
 *          The log level
 */
function config(path, level) {
	setFilePath(path);
	setLogLevel(level);
}

/**
 * True if the given level is enabled to be written or not.
 * 
 * @param level
 *          The log level to check as a value from the LOG_LEVELS enum. If level
 *          is undefined, return true.
 */
function isLevelEnabled(level) {

	return !level || globalLevel != LOG_LEVELS.NONE && globalLevel.value >= level.value;
}

/**
 * Log the given message as an INFO log.
 * 
 * @param message
 */
function logInfo(message) {

	this.log(message, LOG_LEVELS.INFO);
}

/**
 * Log the given message as a DEBUG log.
 * 
 * @param message
 */
function logDebug(message) {

	this.log(message, LOG_LEVELS.DEBUG);
}

/**
 * Log the given message as an ERROR log.
 * 
 * @param message
 */
function logError(message) {

	this.log(message, LOG_LEVELS.ERROR);
}

/**
 * Log the given message with the given log level. The log is written into a
 * file and the console.
 * 
 * To set the filePath, use setLogFilePath, and to set accepted log level, use
 * setLogLevel
 * 
 * @param message
 * @param level
 */
function log(message, level) {

	level = level || LOG_LEVELS.DEBUG;
	if (this.isLevelEnabled(level)) {

		var now = new Date();
		var logMessage = '[' + level.name + '] ' + dateToString(now, true) + ' ' + this.className + ' : ' + message;

		if (globalFilePath != NO_LOG_FILE) {
			var path = globalFilePath + dateToString(now) + '_' + FILE_NAME;

			fs.appendFile(path, NEW_LINE + logMessage, function(err) {

				if (err) {
					console.log('An error occured while write log file. The message will not be recorded. ' + err);
				}
			});
		}

		if (level === LOG_LEVELS.ERROR) {
			console.error(logMessage);
		} else {
			console.log(logMessage);
		}
	}
}

/**
 * Format a Date to a String suitable for printing in console
 * 
 * @param date
 *          The date to print
 * @param hasTime
 *          If the time has to be printed too.
 * @returns The formated String
 */
function dateToString(date, hasTime) {

	var string = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

	if (hasTime) {
		string += ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ',' + date.getMilliseconds();
	}
	return string;

}

// --------------------
// MODULE EXPORT
// --------------------
// Logger constructor
module.exports.Logger = Logger;