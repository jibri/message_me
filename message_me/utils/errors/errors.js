/**
 * Custom Error thrown throughout the app
 * 
 * @constructor
 * @param message
 *            A string message for the error
 */
function CustomError(name, message) {
    this.name = name,
    this.message = message;
}

CustomError.types = {
     INVALID_FORM : 'invalidForm'
};

// MODULE EXPORTS
module.exports = CustomError;