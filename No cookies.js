// ==UserScript==
// @name           No cookies
// @version        1
// @author         Simon Arlott
// @license        GPL-3.0+
// @include        http*://*
// @grant          none
// @run-at         document-idle
// ==/UserScript==


function visible(element) {
  return element && !(element.offsetParent === null);
}

function noCookies() {
  console.debug(`Checking cookie prompts`);

  var manageCookie = document.getElementById("manageCookie");
  if (visible(manageCookie)) {
    console.debug(`Found manageCookie: ${manageCookie.innerText}`);

    if (manageCookie.innerText == "Cookie Settings") {
      manageCookie.click();

      var cookieSettingsContent = document.getElementById("cookieSettingsContent");
      if (cookieSettingsContent) {
        console.debug(`Found cookieSettingsContent`);
        var found = 0;

        var buttons = cookieSettingsContent.querySelectorAll("button.toggle__button");
        for (var i = 0; i < buttons.length; i++) {
          console.debug(`Found button ${buttons[i].getAttribute("id")}: aria-pressed=${buttons[i].getAttribute("aria-pressed")}`);

          if (buttons[i].getAttribute("aria-pressed") == "true") {
            buttons[i].click();

            if (buttons[i].getAttribute("aria-pressed") == "false") {
              console.debug(`Disabled button ${buttons[i].getAttribute("id")}`);
              found++;
            }
          }
        }

        if (found >= 2) {
          var updateCookieButton = document.getElementById("updateCookieButton");
          if (updateCookieButton) {
            console.debug(`Found updateCookieButton`);

            updateCookieButton.click();
          }
        }
      }
    }
  }

  var euOverlayContainer = document.getElementById("euOverlayContainer");
  if (visible(euOverlayContainer)) {
    console.debug(`Found euOverlayContainer: ${euOverlayContainer.innerText}`);

    if (/Cookie Preferences/.test(euOverlayContainer.innerText)) {
      var inputs = euOverlayContainer.querySelectorAll("input[value=Decline][alt=Decline][title=Decline]");
      console.debug(`Inputs: ${inputs.length}`);
      if (inputs.length == 1) {
        // Clicking it too soon interrupts the unnecessary "scroll down and then back up" animation
      	setTimeout((function(){inputs[0].click();}), 100);
      }
    }
  }

  var cookiePolicy = document.querySelectorAll("div.cookiePolicy");
  if (cookiePolicy.length == 1 && visible(cookiePolicy[0])) {
    console.debug(`Found cookiePolicy: ${cookiePolicy[0].innerText}`);

    if (/^This site uses cookies and by using the site you are consenting to this/.test(cookiePolicy[0].innerText)) {
      console.debug(`Found illegal claim`);

      cookiePolicy[0].setAttribute("style", "display: none");
    }
  }

  var cookie_banner_wrapper = document.getElementById("cookie-banner-wrapper");
  if (visible(cookie_banner_wrapper)) {
    console.debug(`Found cookie-banner-wrapper: ${cookie_banner_wrapper.innerText}`);

    if (/^We use cookies to provide you with the best possible online experience/.test(cookie_banner_wrapper.innerText)) {
      console.debug(`Found useless message`);

      cookie_banner_wrapper.setAttribute("style", "display: none");
    }
  }

  var govuk_cookie_banner = document.querySelectorAll("div.govuk-cookie-banner");
  if (govuk_cookie_banner.length == 1 && visible(govuk_cookie_banner[0])) {
    console.debug(`Found govuk_cookie_banner: ${govuk_cookie_banner[0].innerText}`);

    var buttons = govuk_cookie_banner[0].querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      if (/^Reject (additional|analytics) cookies$/.test(buttons[i].innerText)) {
      	console.debug(`Found reject button: ${buttons[i].innerText}`);
        buttons[i].click();
      }
    }

    var confirmation = document.querySelectorAll("div.gem-c-cookie-banner__confirmation");
    if (confirmation.length == 1 && visible(confirmation[0])) {
      console.debug(`Found gem-c-cookie-banner__confirmation: ${confirmation[0].innerText}`);

      // Now you're just being deliberately annoying
      var buttons = confirmation[0].querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        if (/^Hide this message$/.test(buttons[i].innerText)) {
          console.debug(`Found hide button: ${buttons[i].innerText}`);
          buttons[i].click();
        }
      }
    }
  }

  var tealiumGDPRecModal = document.getElementById("__tealiumGDPRecModal");
  if (visible(tealiumGDPRecModal)) {
    console.debug(`Found tealiumGDPRecModal`);

    var choose = tealiumGDPRecModal.querySelector("#let_me_choose");
    if (choose) {
      console.debug(`Found #let_me_choose: ${choose.innerText}`);
      choose.click();
    }
  }

  var tealiumGDPRcpPrefs = document.getElementById("__tealiumGDPRcpPrefs");
  if (visible(tealiumGDPRcpPrefs)) {
    var found = 0;
    var inputs = tealiumGDPRcpPrefs.querySelectorAll("input[type=radio]");
    for (var i = 0; i < inputs.length; i++) {
      var label = tealiumGDPRcpPrefs.querySelector(`label[for=${inputs[i].id}]`);
      if (!label) {
        console.debug(`Radio input ${inputs[i].id} with no label`);
        return;
      } if (label.innerText == "No") {
        console.debug(`Selecting ${inputs[i].id}: ${label.innerText}`);
        inputs[i].click();

        if (inputs[i].checked) {
				  found++;
        }
      } else if (label.innerText != "Yes") {
        console.debug(`Unknown radio input ${inputs[i].id}: ${label.innerText}`);
        return;
      }
    }

    for (var i = 0; i < inputs.length; i++) {
      var label = tealiumGDPRcpPrefs.querySelector(`label[for=${inputs[i].id}]`);
      if ((label.innerText == "Yes" && inputs[i].checked) || (label.innerText == "No" && !inputs[i].checked)) {
        console.debug(`Invalid selection: ${inputs[i].id}: ${label.innerText} (${inputs[i].checked})`);
      }
    }

    if (found >= 2) {
      var prefsSubmit = tealiumGDPRcpPrefs.querySelector("#preferences_prompt_submit");
      if (prefsSubmit) {
        console.debug(`Found #preferences_prompt_submit: ${prefsSubmit.innerText}`);

        if (/^Save preferences$/.test(prefsSubmit.innerText)) {
          prefsSubmit.click();
        }
      }
    }
  }

  if (/^https:\/\/consent\.google\.co\.uk\//.test(document.location.href)) {
    console.debug(`Google consent page`);

    var labelled = new Map();
    var buttons = document.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      if (visible(buttons[i])) {
        console.debug(`"${i}: ${buttons[i].getAttribute("aria-label")}"`);
        if (/More options for ad personalization/.test(buttons[i].getAttribute("aria-label"))) {
          buttons[i].click();
          continue;
        }

        var list = labelled.get(buttons[i].innerText);
        if (!list) {
          list = [];
          labelled.set(buttons[i].innerText, list);
        }
        list.push(buttons[i]);
      }
    }

    console.debug(`Buttons: ${Array.from(labelled.entries())}`);

    if (buttons.length == 2 && labelled.get("I agree") && labelled.get("Customize")) {
      console.debug(`Found customise button`);

      labelled.get("Customize")[0].click();
    }

    if (labelled.size == 3 && labelled.get("On") && labelled.get("Off") && labelled.get("Confirm") && labelled.get("On").length == labelled.get("Off").length) {
      console.debug(`Found on/off/confirm buttons`);

      var off = labelled.get("Off")
      for (var i = 0; i < off.length; i++) {
        off[i].click();
      }

      var confirm = labelled.get("Confirm");
      if (confirm.length == 1) {
        confirm[0].click();
      }
    }
  }

  var js_consent_banner = document.querySelector("div.js-consent-banner");
  if (visible(js_consent_banner)) {
    console.debug(`Found js-consent-banner`);

    var buttons = document.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].innerText == "Customize settings") {
        console.debug(`Found customise button`);

        // Tries to load JavaScript from cookielaw.org which isn't allowed so it doesn't work properly
        //buttons[i].click();
        js_consent_banner.setAttribute("style", "display: none");
      }
    }
  }

  var ovh_banner = document.querySelector("div.manager-cookie-policy-banner");
  if (visible(ovh_banner)) {
    console.debug(`Found ovh banner`);
    var buttons = document.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      if (visible(buttons[i]) && buttons[i].innerText == "Continue without accepting") {
        console.debug(`Found deny button`);
        buttons[i].click();
      }
    }
  }
}

noCookies();

var checkInterval = 100; // Check for changes every 100ms
var waitInterval = 3000; // Stop when there have been no changes for 3000ms
var observer = new MutationObserver(observedChanges);
var checkTimer = setTimeout(startObserving, checkInterval, observer);
var stopTimer = null;

function observedChanges(changes, observer) {
  //console.debug(`Changes observed`);
  observer.disconnect();
  //console.debug(`Stopped observing DOM changes`);
  clearTimeout(stopTimer);
  noCookies();
  checkTimer = setTimeout(startObserving, checkInterval, observer);
}

function startObserving(observer) {
  noCookies();
  //console.debug(`Start observing DOM changes`);
  observer.observe(document, {childList: true, subtree: true});
  stopTimer = setTimeout(stopObserving, waitInterval, observer);
}

function stopObserving(observer) {
  observer.disconnect();
  console.debug(`Finished observing DOM changes`);
  clearTimeout(stopTimer);
  clearTimeout(checkTimer);
}
