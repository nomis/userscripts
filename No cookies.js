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
  if (govuk_cookie_banner.length == 0) {
    govuk_cookie_banner = document.querySelectorAll("div.cbanner-govuk-cookie-banner");
  }
  if (govuk_cookie_banner.length == 1 && visible(govuk_cookie_banner[0])) {
    console.debug(`Found govuk_cookie_banner: ${govuk_cookie_banner[0].innerText}`);

    var buttons = govuk_cookie_banner[0].querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      if (/^Reject (additional|analytics) cookies$/.test(buttons[i].innerText)) {
      	console.debug(`Found reject button: ${buttons[i].innerText}`);
        buttons[i].click();
      }
    }

    if (buttons.length == 1 && visible(buttons[0])) {
      if (/^Hide\b/.test(buttons[0].innerText)) {
        console.debug(`Found hide button: ${buttons[0].innerText}`);
        buttons[0].click();
      }
    }

    if (buttons.length == 0 && /^You.ve rejected .+ cookies/.test(govuk_cookie_banner[0].innerText)) {
      // Now you're just being deliberately annoying
      console.debug(`Found useless message`);
      govuk_cookie_banner[0].parentNode.removeChild(govuk_cookie_banner[0]);
    }
  }

  var confirmation = document.querySelectorAll("div.gem-c-cookie-banner__confirmation");
  if (confirmation.length == 1 && visible(confirmation[0])) {
    console.debug(`Found gem-c-cookie-banner__confirmation: ${confirmation[0].innerText}`);

    if (/^You(.ve| have) rejected additional cookies/.test(confirmation[0].innerText)) {
      // Now you're just being deliberately annoying
      var buttons = confirmation[0].querySelectorAll("button");
      if (buttons.length == 1 && visible(buttons[0])) {
        if (/^Hide\b/.test(buttons[0].innerText)) {
          console.debug(`Found hide button: ${buttons[0].innerText}`);
          buttons[0].click();
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
        console.debug(`"${i}: ${buttons[i].innerText}; ${buttons[i].getAttribute("aria-label")}"`);
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

    labelled.delete("English");

    console.debug(`Labelled buttons (${labelled.size}): ${Array.from(labelled.entries())}`);

    if (labelled.size == 2 && labelled.get("I agree") && labelled.get("Customize")) {
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

    var buttons = js_consent_banner.querySelectorAll("button");
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
    var buttons = ovh_banner.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      if (visible(buttons[i]) && buttons[i].innerText == "Continue without accepting") {
        console.debug(`Found deny button`);
        buttons[i].click();
      }
    }
  }

  var ovh_banner2 = document.getElementById("header_tc_privacy");
  if (visible(ovh_banner2)) {
    console.debug(`Found ovh banner2`);
    var buttons = ovh_banner2.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      if (visible(buttons[i]) && buttons[i].innerText == "Continue without accepting") {
        console.debug(`Found deny button`);
        buttons[i].click();
      }
    }
  }

  var reddit = document.querySelectorAll("a[href='https://www.redditinc.com/policies/cookie-notice']");
  for (var i = 0; i < reddit.length; i++) {
    if (visible(reddit[i])) {
      if (/We use cookies on our websites/.test(reddit[i].parentNode.innerText)) {
        console.debug(`Found reddit cookie link`);

        var buttons = reddit[i].parentNode.parentNode.querySelectorAll("button");
        for (var i = 0; i < buttons.length; i++) {
          if (visible(buttons[i]) && buttons[i].innerText == "Reject non-essential") {
            console.debug(`Found reject button`);
            buttons[i].click();
          }
        }
      }
    }
  }

  var cookie_consent = document.querySelector("div.cookie-consent");
  if (visible(cookie_consent)) {
    console.debug(`Found cookie_consent`);
    var buttons = cookie_consent.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      if (visible(buttons[i]) && buttons[i].innerText == "Manage settings") {
        console.debug(`Found manage settings button`);
        buttons[i].click();
      }
    }

    var tabs = cookie_consent.querySelectorAll('[role="tab"]');
    console.debug(`Tabs: ${tabs.length}`);
    var current = tabs.length;
    for (var i = 0; i < tabs.length; i++) {
      if (!visible(tabs[i]))
        continue;

      if (tabs[i].getAttribute("aria-selected") == "true") {
        console.debug(`Found current tab: ${tabs[i].innerText}`);
        current = i;

        var on = 0;
        var off = 0;
        var inputs = cookie_consent.querySelectorAll('input[role="switch"]');
        for (var j = 0; j < inputs.length; j++) {
          if (visible(inputs[j])) {
            console.debug(`Found input: ${inputs[j].name} (${inputs[j].checked})`);
            if (inputs[j].checked) {
              on++;
            } else {
              off++;
            }
          }
        }

        console.debug(`Total on ${on}, off ${off}`);

        if (i == 0 && /^Strictly necessary cookies$/.test(tabs[i].innerText)) {
          if (on != 0) {
            current = tabs.length; // abort
          }
        } else if (on != 0 || off == 0) {
          current = tabs.length; // abort
        }
      } else if (tabs[i].getAttribute("aria-selected") == "false" && i == current + 1) {
        console.debug(`Found next tab: ${tabs[i].innerText}`);
        tabs[i].click();
        setTimeout(noCookies, 100);
      } else {
        console.debug(`Found tab: ${tabs[i].innerText} (${tabs[i].getAttribute("aria-selected")})`);
      }
    }

    if (current == tabs.length - 1) {
      console.debug(`Finished selections`);

      var buttons = cookie_consent.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        if (visible(buttons[i]) && /^CONFIRM MY CHOICES$/.test(buttons[i].innerText)) {
          console.debug(`Found confirm button`);
          buttons[i].click();
        }
      }
    }
  }

  var cookie_consent = document.querySelector("cookie-consent");
  if (visible(cookie_consent) && cookie_consent.shadowRoot) {
    console.debug(`Found cookie-consent shadowRoot element`);
    var div = cookie_consent.shadowRoot.querySelector("div");
    console.debug(`First div: ${div.innerText}`);
    if (/ uses cookies /.test(div.innerText)) {
      console.debug(`Found "uses cookies" banner`);
      var buttons = div.querySelectorAll("button");
      if (buttons.length == 1 && visible(buttons[0]) && buttons[0].innerText == "Continue") {
        console.debug(`Found illegal banner`);
        cookie_consent.parentNode.removeChild(cookie_consent);
      }
    }
  }

  var cookieMgn = document.getElementById("cookieMgn");
  if (visible(cookieMgn)) {
    console.debug(`Found cookieMgn element`);
    if (/ uses cookies /.test(cookieMgn.innerText)) {
      console.debug(`Found "uses cookies" banner`);
      var a = cookieMgn.querySelectorAll("a");
      if (a.length == 2 && a[0].innerText == "change the cookie settings and view our cookie policy" && a[1].innerText == "Continue") {
        console.debug(`Found illegal banner`);
        cookieMgn.parentNode.removeChild(cookieMgn);
      }
    }
  }

  var fil_cookie_policy = document.querySelector("section.fil-cookie-policy");
  if (visible(fil_cookie_policy)) {
    console.debug(`Found fil-cookie-policy element`);
    if (/ uses cookies /.test(fil_cookie_policy.innerText)) {
      console.debug(`Found "uses cookies" banner`);
      var buttons = fil_cookie_policy.querySelectorAll("button");
      if (buttons.length == 1 && visible(buttons[0]) && buttons[0].innerText == "Continue") {
        console.debug(`Found illegal banner`);
        fil_cookie_policy.parentNode.removeChild(fil_cookie_policy);
      }
    }
  }

  if (/^https:\/\/consent\.yahoo\.com\//.test(document.location.href)) {
    console.debug(`Yahoo consent page`);

    var links = document.querySelectorAll('a[role="button"]');
    for (var i = 0; i < links.length; i++) {
      if (visible(links[i])) {
        if (/^Manage settings$/.test(links[i].innerText)) {
          console.debug(`Found manage settings link`);
          links[i].click();
        }
      }
    }

    var accepts = 0;
    var rejects = 0;
    var on = 0;
    var off = 0;
    var expands = 0;
    var unknowns = 0;
    var labels = document.querySelectorAll("label");
    for (var i = 0; i < labels.length; i++) {
      if (visible(labels[i])) {
        if (labels[i].innerText == "ON") {
          on++;
          labels[i].click();
        } else if (labels[i].innerText == "OFF") {
          off++;
        } else if (labels[i].innerText == "...more") {
        } else if (labels[i].innerText == "Accept all") {
          accepts++;
        } else if (labels[i].innerText == "Reject all") {
          rejects++;
          labels[i].click();
        } else if (/^View by /.test(labels[i].innerText) || /^toggle-(iab-|google-partners$)/.test(labels[i].getAttribute("for"))) {
          expands++;
        } else {
          unknowns++;
          console.debug(`Unknown label: ${labels[i].innerText} (${labels[i].getAttribute("for")})`);
        }
      }
    }
    console.debug(`Summary: accepts=${accepts} rejects=${rejects} on=${on} off=${off} expands=${expands} unknowns=${unknowns}`);
    if (accepts >= 3 && rejects == 0 && on == 0 && off > 10 && expands > 0 && unknowns == 0) {
      var buttons = document.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        if (visible(buttons[i])) {
          if (/^Save and continue$/.test(buttons[i].innerText)) {
            console.debug(`Found continue button`);
            buttons[i].click();
          }
        }
      }
    }
  }

  if (/^https:\/\/guce\.yahoo\.com\//.test(document.location.href)) {
    console.debug(`Yahoo broken redirect page: ${document.documentElement.innerText}`);

    if (document.documentElement.innerText == "If you are not redirected, click here") {
      var links = document.querySelectorAll('a');
      if (links.length == 1 && visible(links[0])) {
        if (links[0].innerText == "here") {
          console.debug(`Found "here" link`);
          links[0].click();
        }
      }
    }
  }

  var cookie_bar__content = document.querySelector("div.cookie-bar__content");
  if (visible(cookie_bar__content)) {
    console.debug(`Found cookie-bar__content element`);
    if (/^This website uses .+ cookies /.test(cookie_bar__content.innerText)) {
      console.debug(`Found "uses cookies" banner`);
      var buttons = cookie_bar__content.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        if (visible(buttons[i]) && buttons[i].innerText == "Decline") {
          console.debug(`Found decline button`);
          buttons[i].click();
        }
      }
    }
  }

  console.debug(`Checked cookie prompts`);
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
