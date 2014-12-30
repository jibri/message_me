/**
 *        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                    Version 2, December 2004
 *
 * Copyright (C) 2004 Jeremie Briand <jeremie.briand@outlook.fr>
 *
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 */

/**
 * Custom Error thrown throughout the app
 * 
 * @constructor
 * @author Jeremie BRIAND
 * @param message
 *            A string message for the error
 */
function CustomError(name, message) {
    this.name = name, this.message = message;
}

CustomError.types = { INVALID_FORM : 'invalidForm' };

// MODULE EXPORTS
module.exports = CustomError;