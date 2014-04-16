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
var AUTOCOMPLETE_SELECTOR = 'autocomplete-input';

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
    return false;
  });

  // Open popup buttons
  $(document).on('click', '.' + OPEN_POPUP_SELECTOR, function() {

    $.get($(this).attr('rel'), function(html) {

      popupContent(html);
      return false;
    });
  });

  // autocomplete
  setAutocomplete('.' + AUTOCOMPLETE_SELECTOR);
  // Tooltip
  setTooltip('.tooltip');
}

/**
 * set autocomplete inputs
 */
function setAutocomplete(selector, inPopup) {

  $(selector).autocomplete({ appendTo : inPopup ? '.' + POPUP_SELECTOR : null,
                            source : [ "c++",
                                      "java",
                                      "php",
                                      "coldfusion",
                                      "javascript",
                                      "asp",
                                      "ruby" ] });
}

/**
 * Set the tooltip to the matching elements
 * 
 * @param selector
 */
function setTooltip(selector) {

  $(selector).tooltip({ 'track' : true,
                       'show' : { delay : 50 },
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

  setAutocomplete($('.' + AUTOCOMPLETE_SELECTOR, popup), true);
}

function closeAllPopup() {

  $('.' + POPUP_SELECTOR).remove();
  $('.' + OVERLAY_SELECTOR).remove();
}

/***********************************************************************************************************************
 * 
 * COMIC STRIP MESSAGES
 * 
 **********************************************************************************************************************/
function bubbleLayout(parentClass) {

  var WIDTH_ADDING_OFFSET = 20;
  var MIN_WIDTH = 130;
  var MAX_WIDTH = 300;
  // Must be smaller than MAX_WITH
  var MIN_DOUBLE_WIDTH = 200;
  // Must be greater than this.bulle-test left margin+border+padding
  var FIRST_LEFT_POS_OFFSET = 50;
  // The height of the double elements. take care of added margins paddings and borders
  var DOUBLE_HEIGHT = 257;
  var PARENT_SELECTOR = '.' + parentClass;

  // First pass to set the layout
  $('.bubble-body').each(function(i) {

    // set the boby to given min width
    $(this).width(MIN_WIDTH);

    // the postion from the left of the parent element
    var leftPos = $(this).offset().left - $(PARENT_SELECTOR).offset().left;
    // if height of this hes been doubled
    var isDoubleHeight = false;
    var parentWidth = $(PARENT_SELECTOR).width();

    // while we have to scroll inside this
    while ($(this).prop('offsetHeight') < $(this).prop('scrollHeight')) {

      // increase this width
      $(this).width($(this).width() + WIDTH_ADDING_OFFSET);

      // get new left pos if this has gotten down (if to large)
      leftPos = $(this).offset().left - $(PARENT_SELECTOR).offset().left;

      // if this is on the very left and larger than given max width
      if (!isDoubleHeight && leftPos < FIRST_LEFT_POS_OFFSET && $(this).width() > MAX_WIDTH) {
        isDoubleHeight = true;

        // doubling this height and pusher height
        $(this).height(DOUBLE_HEIGHT);
        $('.bubble-pusher', this).height($(this).height() - $('.bubble-corner-block', this).height());

        // back to smaller width to avoid big white spaces in the bubble
        $(this).width(MIN_DOUBLE_WIDTH);

        // clear left to avoid this getting back up because of with reduction (MIN_DOUBLE_WIDTH)
        $(this).parent('.bubble-wrapper').addClass('clear');
      }

      // If text is still so big that we need three or more line
      if (isDoubleHeight && $(this).width() >= parentWidth) {
        $(this).width('100%');
        $(this).height($('.bubble-text', this).height());
        $('.bubble-pusher', this).height($(this).height() - $('.bubble-corner-block', this).height());
        break;
      }
    }
  });

  // Second pass to complete rows, vertically center texts.
  $('.bubble-body').each(function(i) {

    var leftPos = $(this).offset().left - $(PARENT_SELECTOR).offset().left;

    if (i + 1 >= $('.bubble-body').length) {
      var isLast = true;
    }
    // set row elements width to fit parent width
    if (isLast || $(this).offset().top - $($('.bubble-body').get(i + 1)).offset().top < 0) {
      $(this).width($(PARENT_SELECTOR).width() - leftPos - 50);
      // $(this).width(Math.max($(this).width(),$(PARENT_SELECTOR).width() - leftPos - 50));
    }

    // add top padding to vertically center the text
    var textHeight = $('.bubble-text', this).height();
    $('.bubble-text', this).css('paddingTop', ($(this).height() - textHeight) / 2 - 10);

    // IE fix if text is over parent padding
    $(this).css('overflow', 'visible');
  });

  // Tooltip
  setTooltip('.bubble-wrapper .tooltip');
}
