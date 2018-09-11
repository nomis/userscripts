// ==UserScript==
// @name ScotRail mandatory tick boxes
// @description Automatically tick the mandatory boxes on the ScotRail buy tickets website.
// @version 2
// @author Simon Arlott
// @license GPL-3.0+
// @include https://www.buytickets.scotrail.co.uk/buytickets/payment.aspx
// @grant none
// ==/UserScript==

/*
 * I don't think it's freely given consent if the "No" option means they'll
 * ask you again each and every time you buy tickets. Apparently I also have
 * to thank them by default.
 */
var inputs = document.getElementsByTagName("input");
var len = inputs.length;
var i;

for (i = 0; i < len; i++) {
  var input = inputs[i];

  if (input.getAttribute("type") == "radio") {
    if (input.getAttribute("name") == "ShoppingBasket_Dpa84Checkbox") {
      if (input.getAttribute("value") == "off") {
        input.checked = true;
      }
    }
  }
}

/*
 * You can't seriously expect people to read 12,000 words every time they
 * buy a ticket. This is another one that asks you every time even though
 * the terms haven't changed since the last time.
 */
var terms = document.getElementById("ShoppingBasket_TermsAndConditions");

if (terms != null) {
  terms.checked = true;
}

/* 😀 🙈 */
var labels = document.getElementsByTagName("label");
var len = labels.length;
var i;

for (i = 0; i < len; i++) {
  var label = labels[i];

  if (label.getAttribute("for") == "ShoppingBasket_Dpa84Checkbox_on") {
    label.innerHTML = "Send me spam (nothing useful like schedule changes or service interruptions)";
  }

  if (label.getAttribute("for") == "ShoppingBasket_Dpa84Checkbox_off") {
    label.innerHTML = "Thermidor aux crevettes with a Mornay sauce, garnished with truffle pâté, brandy and a fried egg on top, <s>and Spam</s>";
  }

  if (label.getAttribute("for") == "ShoppingBasket_TermsAndConditions") {
    label.innerHTML = "I'm not going to read these again: "
  }
}
