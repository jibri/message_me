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

var i18nResolver;

/**
 * Set the i18n resolver to translate messages. This must be set on the main js file.
 * 
 * @Param The
 *          fonction which translate i18n messages.
 */
exports.setI18N = function setI18N(resolver) {

  i18nResolver = resolver;
};

/**
 * 
 * @param form
 * @returns
 */
exports.validateForm = function validateForm(form) {

  var errorObject = {};

  // The form must have a validate attribute
  if (form.validate) {
    var validate = form.validate;

    for ( var i = 0; i < validate.length; i++) {

      var fieldName = validate[i].field;
      var fieldType = validate[i].type;
      var fieldMin = validate[i].min;
      var fieldMax = validate[i].max;
      var fieldNotNull = validate[i].notNull;
      var fieldValue = form[fieldName];

      // ---------------
      // NotNull validation
      // ---------------
      if (!fieldValue || fieldValue == '' || (fieldValue.trim && fieldValue.trim()) === '' || fieldValue.length <= 0) {
        if (fieldNotNull === true) {
          errorObject[fieldName] = i18nResolver(NOT_NULL_ERROR_I18N_KEY);
        }
        continue;
      }

      // ---------------
      // Type validation
      // ---------------
      if (fieldType && !(typeof fieldValue === fieldType)) {

        // It may be an object in a string try parsing
        if (fieldType === 'object') {
          try {

            fieldValue = form[fieldName] = JSON.parse(fieldValue);
          } catch (e) {

            // Type Error.
            errorObject[fieldName] = i18nResolver(TYPE_ERROR_I18N_KEY);
            continue;
          }
        } else if (fieldType === 'array') {
          // Check if array

          if (Array.isArray(fieldValue)) {
            // It is an Array. DO NOTHING
          } else {

            // It is a single value. We put it in an array.
            fieldValue = form[fieldName] = [ form[fieldName] ];
          }
        } else if (fieldType === 'number' && !isNaN(fieldValue)) {

          // It it a number under string form. i.e. '123'. We parse it.
          fieldValue = form[fieldName] = parseFloat(form[fieldName]);
        } else {

          // Type Error.
          errorObject[fieldName] = i18nResolver(TYPE_ERROR_I18N_KEY);
          continue;
        }
      }

      // ---------------
      // Min validation
      // ---------------
      if (fieldMin) {
        if (fieldType === 'number' && fieldValue < fieldMin || fieldValue.length < fieldMin) {

          errorObject[fieldName] = i18nResolver(MIN_ERROR_I18N_KEY);
          continue;
        }
      }

      // ---------------
      // Max validation
      // ---------------
      if (fieldMax) {
        if (fieldType === 'number' && fieldValue > fieldMax || fieldValue.length > fieldMax) {

          errorObject[fieldName] = i18nResolver(MAX_ERROR_I18N_KEY);
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
};

/**
 * Map the form, transforming dotted properties to inner objects.
 * 
 * <pre>
 * i.e. :
 * {
 * name: 'John',
 * car.name: 'BMW',
 * car.age: '12' 
 * } 
 * 
 * becomes :
 * {
 * name: 'John',
 * car: {
 *      name: 'BMW',
 *      age: '12'
 *      }
 * }
 * </pre>
 * 
 * @param rawForm
 *          The raw form to map
 * @returns The mapped form
 */
exports.mapForm = function mapForm(rawForm) {

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
};