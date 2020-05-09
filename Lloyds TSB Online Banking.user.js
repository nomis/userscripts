// ==UserScript==
// @name           Lloyds TSB Online Banking
// @version        2
// @author         Simon Arlott
// @license        GPL-3.0+
// @include        https://*.tsb.co.uk/*
// @include        https://*.lloydsbank.co.uk/*
// @include        https://*.halifax-online.co.uk/*
// @include        https://*.bankofscotland.co.uk/*
// @grant          none
// ==/UserScript==

console.debug("Loading");

var scrollX = 0;
var scrollY = 0;

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

addGlobalStyle(`
body .m-container { max-width: 1600px !important; }

/* Remember this device popup */
#browserRegRetail { display: none !important; }
`);

var spans = document.getElementsByTagName('span');
var l = spans.length;
for (var i = 0; i < l; i++) {
  if (spans[i].innerHTML == " " && spans[i].nextSibling != null) {
    spans[i].innerHTML = " | ";
  }
}

/* Allow login selection boxes to be controlled by the keyboard */
var options = document.getElementsByTagName('option');
var l = options.length;
for (var i = 0; i < l; i++) {
  if (options[i].innerText.length == 2 && (options[i].innerText.substring(0, 1) == " " || options[i].innerText.substring(0, 1) == "\u00A0")) {
    console.log("Fixing login box " + i);
    options[i].innerText = options[i].innerText.substring(1);
  }
}

function closeStatements() {
  var trs = document.getElementsByTagName("tr");
  var l = trs.length;
  var ok = 1;

  for (var i = 0; i < l; i++) {
    if (!trs[i].id || !trs[i].id.startsWith("clickable-"))
      continue;

    var txn = trs[i];
    var detail = document.getElementById(trs[i].id.replace("clickable-", "transaction-detail-"));

    if (!detail)
      continue;

    if (txn.getAttribute("greasemonkey-updated") == "true")
      continue;

    /* Check data has finished loading */
    if (detail.getElementsByTagName("div").length < 2) {
      ok = 0;
      continue;
    }

    var tds = txn.getElementsByTagName("td");
    if (tds.length >= 3) {
      txn.style = txn.getAttribute("style") + "; cursor: inherit !important;";

      var l2 = tds.length;
      for (var j = 0; j < l2; j++) {
        tds[j].style = tds[j].getAttribute("style") + "; padding-top: 0 !important; padding-bottom: 0 !important;";
      }

      /* Make description wider */
      tds[1].style = tds[1].getAttribute("style") + "; width: 50% !important; font-family: monospace !important; font-size: small !important;";
      tds[2].style = tds[2].getAttribute("style") + "; width: 1% !important;";

      var divs = tds[1].getElementsByTagName("div");
      l2 = divs.length;
      for (var j = 0; j < l2; j++) {
        divs[j].style = divs[j].getAttribute("style") + "; display: inline !important; color: inherit !important; font-family: inherit !important;";
      }

      divs[0].innerHTML += " ";
      var desc = divs[1];
      if (tds[2].innerText != "") {
        desc.innerHTML = tds[2].innerHTML + " " + desc.innerHTML;
      }

      /* Remove type */
      var type = tds[2].innerText;
      tds[2].innerHTML = "";

      console.debug("Txn: " + desc.innerText);
      var newdesc = "";

      var divs = detail.getElementsByTagName("div");
      l2 = divs.length;
      for (var j = 0; j < l2; j++) {
        if (divs[j].className == "tsmTranDetails") {
          var name = "";
          var value = "";

          var ps = divs[j].getElementsByTagName("div");
          var l3 = ps.length;
          for (var k = 0; k < l3; k++) {
            if (ps[k].className == "tsmDescription") {
              name = ps[k].innerText;
            }
            if (ps[k].className == "tsmValue") {
              if (value != "") {
                value += " | ";
              }

              value += ps[k].innerText;
            }
          }

          if (value != "") {
            console.debug("Name: \"" + name + "\"; Value: \"" + value + "\"");
            if (type == "FPO") {
              if (name == "Date of transaction:") {
                newdesc += " | " + value;
              }
              if (name == "Time of transaction:") {
                newdesc += " " + value;
              }
            }
            if (name == "Reference:") {
              newdesc = " | " + value + newdesc;
            }
            if (name == "Retailer location:") {
              newdesc += " | " + value;
            }
            if (name == "Card number:") {
              newdesc += " | CD " + value;
            }
          }
        }
      }

      desc.innerHTML += newdesc;

      console.debug("Closing " + txn.id);
      txn.setAttribute("greasemonkey-updated", "true");

      tds[1].click();
    }
  }

  if (ok) {
    window.scrollTo(scrollX, scrollY);
    setTimeout(openStatements, 1000);
  } else {
    setTimeout(closeStatements, 500);
  }
}

function openStatements() {
  var table = document.getElementById("statementTable");
  if (!table) {
    setTimeout(openStatements, 1000);
    return;
  }

  console.debug("Found statementTable");
  scrollX = window.scrollX;
  scrollY = window.scrollY;

  var trs = table.getElementsByTagName("tr");
  var l = trs.length;
  var ok = 0;

  for (var i = 0; i < l; i++) {
    if (trs[i].id == "headerRow") {
      /* Make description wider */
      trs[i].getElementsByTagName("th")[1].style = trs[i].getElementsByTagName("th")[1].getAttribute("style") + "; width: 50% !important;";
      trs[i].getElementsByTagName("th")[2].style = trs[i].getElementsByTagName("th")[2].getAttribute("style") + "; width: 1% !important;";
      /* Remove type */
      trs[i].getElementsByTagName("th")[2].innerHTML = "";
    }

    if (!trs[i].id || !trs[i].id.startsWith("clickable-"))
      continue;

    var txn = trs[i];
    var detail = document.getElementById(trs[i].id.replace("clickable-", "transaction-detail-"));

    if (!detail)
      continue;

    if (txn.getAttribute("aria-expanded") != "false")
      continue;

    if (txn.getAttribute("greasemonkey-updated") == "true")
      continue;

    console.debug("Expanding " + txn.id);

    ok = 1;

    var tds = txn.getElementsByTagName("td");
    tds[0].click();
  }

  if (ok) {
    closeStatements();
  } else {
    setTimeout(openStatements, 1000);
  }
}

setTimeout(openStatements, 100);

console.debug("Loaded");

