// ==UserScript==
// @name     American Express Wider
// @version  1
// @author   Simon Arlott
// @license  GPL-3.0+
// @include  https://global.americanexpress.com/*
// @grant    none
// ==/UserScript==

var style = document.createElement('style');
style.innerHTML = "div.statement-container, div.container { max-width: 1600px !important; }";
document.head.appendChild(style);
