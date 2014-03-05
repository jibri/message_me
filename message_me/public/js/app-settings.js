var OPEN_POPUP_SELECTOR = 'open-popup';
var CLOSE_POPUP_SELECTOR = 'close-popup';
var SUBMIT_BUTTON_SELECTOR = 'submit-button';
var POPUP_SELECTOR = 'popup-wrapper';
var OVERLAY_SELECTOR = 'overlay';
var FRAME_SELECTOR = 'frame-wrapper';
var FRAME_CONTENT_SELECTOR = 'frame-content';
var FRAME_TITLE_SELECTOR = 'frame-title';
var INPUT_SELECTOR = 'form-input';
var VALIDATION_ERROR_SELECTOR = 'validation-error';
var VALIDATION_ERROR_MESSAGE_SELECTOR = 'validation-error-message';

/**
 * APP default settings
 */
$(document).ready(function() {

  initForms();
  initButtons();
});

/**
 * Initialize the forms
 */
function initForms() {

  $.ajaxSetup({ error : function(jqXHR, textStatus, errorThrown) {

                 try {
                   var errorMessageClass = 'div.' + VALIDATION_ERROR_MESSAGE_SELECTOR;
                   var errorInputClass = 'form .' + INPUT_SELECTOR;

                   $('form .' + INPUT_SELECTOR).removeClass(VALIDATION_ERROR_SELECTOR);
                   $(errorMessageClass).removeClass('visible');

                   // JSON response error
                   var json = JSON.parse(jqXHR.responseText);

                   for ( var key in json) {
                     if (key === 'message') {
                       continue;
                     }

                     $(errorInputClass + '#' + key).addClass(VALIDATION_ERROR_SELECTOR);
                     $(errorMessageClass + '.' + key).html(json[key]);

                   }

                   // on focus, Remove coloration and show eror message
                   $(errorInputClass).one('focus', function() {

                     if ($(this).hasClass(VALIDATION_ERROR_SELECTOR)) {
                       $(this).removeClass(VALIDATION_ERROR_SELECTOR);
                       $(errorMessageClass + '.' + $(this).attr('id')).addClass('visible');
                     }
                   });

                   // Remove the message on blur
                   $(errorInputClass).one('blur', function() {

                     $(errorMessageClass + '.' + $(this).attr('id')).removeClass('visible');
                   });

                   alert(json.message);

                 } catch (e) {
                   // Text response error
                   alert(jqXHR.responseText);
                 }
               },
               complete : function() {

                 $('.' + SUBMIT_BUTTON_SELECTOR).removeClass('loading');
               } });
}

/**
 * Initialize the buttons generic actions
 */
function initButtons() {

  // Submit buttons
  $(document).on('click', '.' + SUBMIT_BUTTON_SELECTOR, function() {

    submitButtonClickHandler($(this));
    return false;
  });
  $(document).on('keypress', 'form', function(event) {

    if (event.which === 13) {
      submitButtonClickHandler($('.' + SUBMIT_BUTTON_SELECTOR, $(this)));
      return false;
    }
  });

  // Close popup buttons
  $(document).on('click', '.' + CLOSE_POPUP_SELECTOR, function() {

    closeAllPopup();
  });

  // Open popup buttons
  $(document).on('click', '.' + OPEN_POPUP_SELECTOR, function() {

    $.get($(this).attr('rel'), function(html) {

      popupContent(html);
    });
  });

  // Tooltip
  $('.tooltip').tooltip({ 'track' : true,
                         'show' : { delay : 400 },
                         'hide' : false,
                         'position' : { my : "left+15 top+15",
                                       at : "left bottom",
                                       collision : "flipfit" } });
}

/**
 * Handler of form submition.
 * 
 * On success, the function calls a function with the name built on the form id : 'handle' + form id + 'Success'. The id
 * is splited on '-' and the first letter of each word is capitalized. (i.e. 'form-id' becomes handleFormIdSuccess).
 * 
 * The function is given the result as a parameter.
 * 
 * If there is no function named this way, the result is supposed to be HTML content, and is inserted in the 'body'
 * element.
 * 
 * @param button
 *          Submit button whose 'rel' attribute is the form id.
 */
function submitButtonClickHandler(button) {

  var formId = button.attr('rel');
  button.addClass('loading');

  $("form#" + formId).ajaxSubmit({ success : function(result) {

    if (result) {
      var escapedId = '';
      var arrayId = formId.split('-');
      for ( var i = 0; i < arrayId.length; i++) {
        escapedId += arrayId[i].charAt(0).toUpperCase() + arrayId[i].slice(1);
      }
      var handler = 'handle' + escapedId + 'Success';

      if (window[handler]) {
        window[handler](result);
      } else {
        $('body').html(result);
      }
    }
  } });
}

/***********************************************************************************************************************
 * 
 * FRAME TAG UTILS
 * 
 **********************************************************************************************************************/

/**
 * Sets the html content of a Frame tag
 */
function setFrameContent(frameClass, content) {

  $('.' + frameClass + '.' + FRAME_SELECTOR + ' .' + FRAME_CONTENT_SELECTOR).html(content);
}

/**
 * Sets the html title of a Frame tag
 */
function setFrameTitle(frameClass, title) {

  $('.' + frameClass + '.' + FRAME_SELECTOR + ' .' + FRAME_TITLE_SELECTOR).html(title);
}

/***********************************************************************************************************************
 * 
 * POPUP
 * 
 **********************************************************************************************************************/

/**
 * Creates a popup with the given content
 */
function popupContent(htmlContent) {

  $('body').append('<div class="' + OVERLAY_SELECTOR + '"></div>');
  var popup = $('<div class="' + POPUP_SELECTOR + '">' + htmlContent + '</div>');

  $('body').append(popup);

  var width = popup.width();
  var height = popup.height();
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  popup.css('top', (windowHeight - height) / 2);
  popup.css('left', (windowWidth - width) / 2);

  popup.draggable();
}

function closeAllPopup() {

  $('.' + POPUP_SELECTOR).remove();
  $('.' + OVERLAY_SELECTOR).remove();
}