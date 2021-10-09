// ==UserScript==
// @name           No cookies
// @version        1
// @author         Simon Arlott
// @license        GPL-3.0+
// @include        https://*
// @grant          none
// @run-at         document-idle
// ==/UserScript==

function noCookies() {
  console.debug(`Checking cookie prompts`);

  var manageCookie = document.getElementById("manageCookie");
  if (manageCookie) {
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
  if (euOverlayContainer && !(euOverlayContainer.offsetParent === null)) {
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
  if (cookiePolicy.length == 1 && !(cookiePolicy[0].offsetParent === null)) {
    console.debug(`Found cookiePolicy: ${cookiePolicy[0].innerText}`);

    if (/This site uses cookies and by using the site you are consenting to this/.test(cookiePolicy[0].innerText)) {
      console.debug(`Found illegal claim`);

      cookiePolicy[0].setAttribute("style", "display: none");
    }
  }

  var cookie_banner_wrapper = document.getElementById("cookie-banner-wrapper");
  if (cookie_banner_wrapper && !(cookie_banner_wrapper.offsetParent === null)) {
    console.debug(`Found cookie-banner-wrapper: ${cookie_banner_wrapper.innerText}`);

    if (/We use cookies to provide you with the best possible online experience/.test(cookie_banner_wrapper.innerText)) {
      console.debug(`Found useless message`);

      cookie_banner_wrapper.setAttribute("style", "display: none");
    }
  }

  var govuk_cookie_banner = document.querySelectorAll("div.govuk-cookie-banner");
  if (govuk_cookie_banner.length == 1 && !(govuk_cookie_banner[0].offsetParent === null)) {
    console.debug(`Found govuk_cookie_banner: ${govuk_cookie_banner[0].innerText}`);

    var buttons = govuk_cookie_banner[0].querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      if (/Reject (additional|analytics) cookies/.test(buttons[i].innerText)) {
      	console.debug(`Found reject button: ${buttons[i].innerText}`);
        buttons[i].click();
      }
    }

    var confirmation = document.querySelectorAll("div.gem-c-cookie-banner__confirmation");
    if (confirmation.length == 1 && !(confirmation[0].offsetParent === null)) {
      console.debug(`Found gem-c-cookie-banner__confirmation: ${confirmation[0].innerText}`);

      // Now you're just being deliberately annoying
      var buttons = confirmation[0].querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        if (/Hide this message/.test(buttons[i].innerText)) {
          console.debug(`Found hide button: ${buttons[i].innerText}`);
          buttons[i].click();
        }
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
