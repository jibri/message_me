/**
 * Form validation utilities Module
 * 
 * This module allow to validate forms after being recieved from a GET/POST request.
 * 
 * To be validate, the forms Object must have specific attribute. The form fields are normal attributes, and it also
 * should have a validate attribute which contains informations about fields validations.
 * 
 * i.e. loginForm:
 * 
 * <pre>
 * { login : 'myLogin';,
 *   password : 'myPassword';,
 *   validate : [ { field : 'login',
 *                  type : 'string',
 *                  notNull : true },
 * 
 *                { field : 'password',
 *                  type : 'string',
 *                  notNull : true }]
 * </pre>
 * 
 * The 'validate' attribute is an array of objects. Each object concerne one field validation and required the name of
 * the field. others attributes of these object are for validation. Now supported attributes are :
 * <ul>
 * <li>notNull: true if the field must not be null or undefined or empty trimmed string or empty array</li>
 * <li>max: a max value to not exceed. available for numbers, string length, array length</li>
 * <li>min: a min value to not exceed. available for numbers, string length, array length</li>
 * <li>type: The type of the field in a quoted string. available values are 'string', 'object', 'array', 'number'</li>
 * </ul>
 */

var TYPE_ERROR_I18N_KEY = 'validation_bad_type_field';
var MIN_ERROR_I18N_KEY = 'validation_under_min_field';
var MAX_ERROR_I18N_KEY = 'validation_above_max_field';
var NOT_NULL_ERROR_I18N_KEY = 'validation_required_field';

/**
 * 
 * @param form
 * @returns {___anonymous72_73}
 */
exports.validateForm = function validateForm(form) {

  var errorObject = {};

  // The form must have a validate attribute
  if (form.validate) {
    var validate = form.validate;

    for (var i = 0; i < validate.length; i++) {

      var fieldName = validate[i].field;
      var fieldType = validate[i].type;
      var fieldMin = validate[i].min;
      var fieldMax = validate[i].max;
      var fieldNotNull = validate[i].notNull;
      console.log("fieldName " + fieldName);
      console.log("fieldType " + fieldType);
      console.log("fieldMin " + fieldMin);
      console.log("fieldMax " + fieldMax);
      console.log("fieldNotNull " + fieldNotNull);

      var fieldValue = form[fieldName];
      console.log("fieldValue " + fieldValue);
      console.log("fieldValue length " + fieldValue.length);

      // ---------------
      // NotNull validation
      // ---------------
      if (!fieldValue || fieldValue == '' || (fieldValue.trim && fieldValue.trim()) === '' || fieldValue.length <= 0) {
        if (fieldNotNull === true) {
          console.log("notnull false");
          errorObject[fieldName] = NOT_NULL_ERROR_I18N_KEY;
        }
        continue;
      }

      // ---------------
      // Type validation
      // ---------------
      if (fieldType && !(typeof fieldValue === fieldType)) {
        console.log("type false " + typeof fieldValue + " instead of " + fieldType);

        // Check if array
        if (fieldType === 'array') {

          if (Array.isArray(fieldValue)) {

            // It is an Array. DO NOTHING
            console.log("type OK It is an array");
          } else {

            // It is a single value. We put it in an array.
            console.log("arraytise the field " + fieldName);
            fieldValue = form[fieldName] = [ form[fieldName] ];
          }
        } else if (fieldType === 'number' && !isNaN(fieldValue)) {

          // It it a number under string form. i.e. '123'. We parse it.
          fieldValue = form[fieldName] = parseFloat(form[fieldName]);
        } else {

          // Type Error.
          errorObject[fieldName] = TYPE_ERROR_I18N_KEY;
          continue;
        }
      }

      // ---------------
      // Min validation
      // ---------------
      if (fieldMin) {
        if (fieldType === 'number' && fieldValue < fieldMin || fieldValue.length < fieldMin) {
          console.log("min false");
          errorObject[fieldName] = MIN_ERROR_I18N_KEY;
          continue;
        }
      }

      // ---------------
      // Max validation
      // ---------------
      if (fieldMax) {
        if (fieldType === 'number' && fieldValue > fieldMax || fieldValue.length > fieldMax) {
          console.log("max false");
          errorObject[fieldName] = MAX_ERROR_I18N_KEY;
          continue;
        }
      }
    }
  }

  if (Object.keys(errorObject).length > 0) {
    if (form.message) {
      errorObject.message = form.message;
    }
  } else {
    return;
  }

  return errorObject;
}

function mapForm(rawForm) {

  var finalForm = {};
  var temp;
  for ( var props in rawForm) {
    temp = finalForm;
    var parts = props.split('.');
    var key = parts.pop();
    while (parts.length) {
      var part = parts.shift();
      temp = temp[part] = temp[part] || {};
    }
    temp[key] = rawForm[props];
  }
  return finalForm;
}