// ==UserScript==
// @name     American Express Wider
// @version  1
// @author   Simon Arlott
// @license  GPL-3.0+
// @include  https://global.americanexpress.com/activity/*
// @grant    none
// ==/UserScript==

var style = document.createElement('style');
style.setAttribute("type", "text/css");
style.innerHTML = "\
div.statement-container, div.container { max-width: 1600px !important; }\
div[data-module-name=\"axp-activity-links\"], div[data-module-name=\"axp-activity-preview\"] { display: none !important; }\
div[data-module-name=\"axp-activity-content\"] { flex-basis: 100% !important; max-width: 100% !important; }\
";
document.head.appendChild(style);
