/**
 * Is the dialog currently onscreen?
 */
var isDialogVisible = false;

/**
 * A closing dialog should animate towards this element.
 * @type Element
 */
var dialogOrigin = null;

/**
 * A function to call when a dialog closes.
 * @type Function
 */
var dialogDispose = null;

/**
 * If the user preses enter, escape, or space, hide the dialog.
 * @param {!Event} e Keyboard event.
 */
var dialogKeyDown = function(e) {
  if (isDialogVisible) {
    if (e.keyCode == 13 ||
        e.keyCode == 27 ||
        e.keyCode == 32) {
      exports.hide(true);
      e.stopPropagation();
      e.preventDefault();
    }
  }
};

/**
 * Start listening for dialogKeyDown.
 */
var startDialogKeyDown = function() {
  document.body.addEventListener('keydown', dialogKeyDown, true);
};

/**
 * Stop listening for dialogKeyDown.
 */
var stopDialogKeyDown = function() {
  document.body.removeEventListener('keydown', dialogKeyDown, true);
};

/**
 * Compute the absolute coordinates and dimensions of an HTML or SVG element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 */
var getBBox = function(element) {
  var x, y, width, height, bBox;
  if (element.getBBox) {
    // SVG element.
    if (window.navigator.userAgent.indexOf("MSIE") >= 0 ||
        window.navigator.userAgent.indexOf("Trident") >= 0) {
      textElement.style.display = "inline";   /* reqd for IE */
      bBox = {
          x: textElement.getBBox().x,
          y: textElement.getBBox().y,
          width: textElement.scrollWidth,
          height: textElement.scrollHeight
      };
    }
    else {
      bBox = element.getBBox();
    }

    height = bBox.height;
    width = bBox.width;
    var xy = Blockly.getAbsoluteXY_(element);
    x = xy.x;
    y = xy.y;
  } else {
    // HTML element.
    height = element.offsetHeight;
    width = element.offsetWidth;
    x = 0;
    y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);
  }
  return {
    height: height,
    width: width,
    x: x,
    y: y
  };
};

/**
 * Match the animated border to the a element's size and location.
 * @param {!Element} element Element to match.
 * @param {boolean} animate Animate to the new location.
 * @param {number} opacity Opacity of border.
 */
var matchBorder = function(element, animate, opacity) {
  if (!element) {
    return;
  }
  var border = document.getElementById('dialogBorder');
  var bBox = getBBox(element);
  function change() {
    border.style.width = bBox.width + 'px';
    border.style.height = bBox.height + 'px';
    border.style.left = bBox.x + 'px';
    border.style.top = bBox.y + 'px';
    border.style.opacity = opacity;
  }
  if (animate) {
    border.className = 'dialogAnimate';
    window.setTimeout(change, 1);
  } else {
    border.className = '';
    change();
  }
  border.style.visibility = 'visible';
};

/**
 * Show the dialog pop-up.
 * @param {!Object} options Configuration options, detailed below.
 *   - {!Element} content DOM element to display in the dialog.
 *   - @param {Element} origin Animate the dialog opening/closing from/to this
 *         DOM element.
 *   - {boolean} animate Animate the dialog opening, defaults to true.
 *   - {boolean} modal Makes dialog modal, defaults to true.
 *   - {!Object} style A dictionary of style rules for the dialog.
 *   - {Function} disposeFunc A function to call when the dialog closes.
 */
exports.show = function(options) {
  var finalConfig = {
    animate: true,
    modal: true,
    origin: null
  };
  for (var key in options) {
    finalConfig[key] = options[key];
  }

  if (isDialogVisible) {
    exports.hide(false);
  }
  isDialogVisible = true;
  dialogOrigin = finalConfig.origin;
  dialogDispose = function() {
    stopDialogKeyDown();
    if (finalConfig.disposeFunc) {
      finalConfig.disposeFunc();
    }
  };
  var dialog = document.getElementById('dialog');
  var shadow = document.getElementById('dialogShadow');
  var border = document.getElementById('dialogBorder');

  // Copy all the specified styles to the dialog.
  for (var name in finalConfig.style) {
    dialog.style[name] = finalConfig.style[name];
  }
  dialog.appendChild(finalConfig.content);
  finalConfig.content.className =
      finalConfig.content.className.replace('dialogHiddenContent', '');

  if (finalConfig.modal) {
    shadow.style.visibility = 'visible';
    shadow.style.opacity = 0.3;
  }
  function endResult() {
    dialog.style.visibility = 'visible';
    dialog.style.zIndex = 1;
    border.style.visibility = 'hidden';
  }
  if (finalConfig.animate && finalConfig.origin) {
    matchBorder(finalConfig.origin, false, 0.2);
    matchBorder(finalConfig.dialog, true, 0.8);
    // In 175ms show the dialog and hide the animated border.
    window.setTimeout(endResult, 175);
  } else {
    // No animation.  Just set the final state.
    endResult();
  }
  startDialogKeyDown();
};

/**
 * Hide the dialog pop-up.
 * @param {boolean} opt_animate Animate the dialog closing.  Defaults to true.
 *     Requires that origin was not null when dialog was opened.
 */
exports.hide = function(opt_animate) {
  if (!isDialogVisible) {
    return;
  }
  isDialogVisible = false;
  if (dialogDispose) {
    dialogDispose();
    dialogDispose = null;
  }
  var origin = (opt_animate === false) ? null : dialogOrigin;
  var dialog = document.getElementById('dialog');
  var shadow = document.getElementById('dialogShadow');
  var border = document.getElementById('dialogBorder');

  shadow.style.opacity = 0;

  function endResult() {
    shadow.style.visibility = 'hidden';
    border.style.visibility = 'hidden';
  }
  if (origin) {
    matchBorder(dialog, false, 0.8);
    matchBorder(origin, true, 0.2);
    // In 175ms hide both the shadow and the animated border.
    window.setTimeout(endResult, 175);
  } else {
    // No animation.  Just set the final state.
    endResult();
  }
  dialog.style.visibility = 'hidden';
  dialog.style.zIndex = -1;
  while (dialog.firstChild) {
    var content = dialog.firstChild;
    content.className += ' dialogHiddenContent';
    document.body.appendChild(content);
  }
};
