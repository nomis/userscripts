// ==UserScript==
// @name           Lloyds TSB Online Banking
// @author         Simon Arlott
// @license        GPL-3.0+
// @include        https://*.tsb.co.uk/*
// @include        https://*.lloydsbank.co.uk/*
// @include        https://*.halifax-online.co.uk/*
// @include        https://*.bankofscotland.co.uk/*
// @grant          none
// ==/UserScript==

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

var options = document.getElementsByTagName('option');
var l = options.length;
for (var i = 0; i < l; i++) {
	if (options[i].innerText.length == 2 && (options[i].innerText.substring(0, 1) == " " || options[i].innerText.substring(0, 1) == "\u00A0")) {
		options[i].innerText = options[i].innerText.substring(1);
	}
}

function closeStatements() {
	var trs = document.getElementsByTagName('tr');
	var l = trs.length;

	for (var i = 0; i < l; i++) {
		if (!trs[i].id || !trs[i].id.startsWith("clickable-"))
			continue;

		var txn = trs[i];
		var detail = document.getElementById(trs[i].id.replace("clickable-", "transaction-detail-"));

		if (!detail)
			continue;

		var tds = txn.getElementsByTagName("td");
		if (tds.length >= 3) {
			var ok = 0;

			txn.style = txn.getAttribute("style") + "; cursor: inherit !important;";
			tds[1].style = tds[1].getAttribute("style") + "; color: inherit !important; font-family: inherit !important;";
			tds[1].innerHTML = tds[2].innerHTML + " " + tds[1].innerHTML;
			//tds[2].innerHTML = "";

			var l2 = tds.length;
			for (var j = 0; j < l2; j++) {
				tds[j].style = tds[j].getAttribute("style") + "; padding-top: 0 !important; padding-bottom: 0 !important;";
			}

			var divs = detail.getElementsByTagName("div");
			l2 = divs.length;
			for (var j = 0; j < l2; j++) {
				if (divs[j].className == "completeDescription") {
					var ps = divs[j].getElementsByTagName("p");
					var l3 = ps.length;
					for (var k = 0; k < l3; k++) {
						if (ps[k].className == "value")
							tds[1].innerHTML += " | " + ps[k].innerHTML;
					}

					ok = 1;
				}
				if (divs[j].className == "cardNumber") {
					var ps = divs[j].getElementsByTagName("p");
					var l3 = ps.length;
					for (var k = 0; k < l3; k++) {
						if (ps[k].className == "value")
							tds[1].innerHTML += " CD " + ps[k].innerHTML;
					}

					ok = 1;
				}
			}

			tds[1].click();
			if (ok)
				txn.id = "not" + txn.id;
		}
	}

	window.scrollTo(0, 0);
}

function waitStatements() {
	var trs = document.getElementsByTagName('tr');
	var l = trs.length;
	var ok = 1;

	for (var i = 0; i < l; i++) {
		if (!trs[i].id || !trs[i].id.startsWith("clickable-"))
			continue;

		var txn = trs[i];
		var detail = document.getElementById(trs[i].id.replace("clickable-", "transaction-detail-"));

		if (!detail)
			continue;

		if (txn.getAttribute("aria-expanded") != "true" && txn.getAttribute("style") == "") {
			ok = 0;
			continue;
		}
	}

	if (ok)
		closeStatements();
	else
		setTimeout(waitStatements, 50);
}

function openStatements() {
	var trs = document.getElementsByTagName('tr');
	var l = trs.length;
	var ok = 0;

	for (var i = 0; i < l; i++) {
		if (!trs[i].id || !trs[i].id.startsWith("clickable-"))
			continue;

		var txn = trs[i];
		var detail = document.getElementById(trs[i].id.replace("clickable-", "transaction-detail-"));

		if (!detail)
			continue;

		if (txn.getAttribute("aria-expanded") != "false")
			continue;

		ok = 1;


		var tds = txn.getElementsByTagName("td");
		if (tds.length >= 2) {
			tds[1].click();
		}
	}

	if (ok)
		waitStatements();
	else
		setTimeout(openStatements, 50);
}

var divs = document.getElementsByTagName('div');
var l = divs.length;

for (var i = 0; i < l; i++) {
	if (divs[i].className == "statements-wrap") {
		setTimeout(openStatements, 50);
		break;
	}
}

