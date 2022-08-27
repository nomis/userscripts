// ==UserScript==
// @name           Online Banking
// @version        0
// @author         Simon Arlott
// @license        GPL-3.0+
// @include        https://*
// @grant          none
// ==/UserScript==

/* Allow login selection boxes to be controlled by the keyboard */
var options = document.getElementsByTagName('option');
var l = options.length;
for (var i = 0; i < l; i++) {
  if (options[i].innerText.length == 2 && (options[i].innerText.substring(0, 1) == " " || options[i].innerText.substring(0, 1) == "\u00A0")) {
    console.log("Fixing login box " + i);
    options[i].innerText = options[i].innerText.substring(1);
  }
}

