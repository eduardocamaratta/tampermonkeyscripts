// ==UserScript==
// @name         GauchaZH Paywall Killer
// @namespace    gmcamaratta
// @version      1.0
// @description  This script disables the paywall from GauchaZH
// @author       Eduardo Camaratta
// @match        http*://gauchazh.clicrbs.com.br/*
// @grant        none
// @run-at       document-start
// @downloadURL  https://github.com/eduardocamaratta/tampermonkeyscripts/raw/master/GauchaZHPaywallKiller.user.js
// ==/UserScript==

// Don't execute for the root page. This is only needed because both the @match and @include tags don't support full RE syntax
if(window.location.href.match(/^https?\:\/\/gauchazh.clicrbs.com.br\/?$/)) return;

(function() {
  'use strict';

  // Die, die
  window.stop();
  var request = new XMLHttpRequest();

  request.open('GET', location.href);
  request.onload = function(event) {
    // Freeze all scripts
    var html = request.responseText
      .replace(/type=\"text\/javascript\"/g, '')
      .replace(/<script/g, '<script type="x-instrument/javascript"');

     document.open();
     document.write(html);
     document.close();

     // Cha ching
     document.getElementsByClassName('m-paid-content')[0].style = "";
  };
  request.send(null);
})();