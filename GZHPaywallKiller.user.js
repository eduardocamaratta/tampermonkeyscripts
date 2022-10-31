// ==UserScript==
// @name         GZH Paywall Killer
// @namespace    gzhpaywallkiller
// @version      2.0
// @description  This script disables the paywall from GZH
// @author       Eduardo Camaratta
// @match        http*://gauchazh.clicrbs.com.br/*
// @match        http*://especiais.zh.clicrbs.com.br/*
// @grant        none
// @run-at       document-start
// @downloadURL  https://github.com/eduardocamaratta/tampermonkeyscripts/raw/master/GZHPaywallKiller.user.js
// ==/UserScript==

// Don't execute for the root page. This is only needed because both the @match and @include tags don't support full RE syntax
if(window.location.href.match(/^https?\:\/\/gauchazh.clicrbs.com.br\/?$/)) return;

document.addEventListener('DOMContentLoaded', function() {
  var htmlRequest = new XMLHttpRequest();
  htmlRequest.open('GET', location.href);
  htmlRequest.onload = function(event) {

      var html = htmlRequest.responseText;
      let scriptUrl = location.origin + html.match(/\/static\/main\.[^\.]*\.min.js/)[0];
      html = html.replace(/\/static\/main\.[^\.]*\.min.js/, "");

      var scriptRequest = new XMLHttpRequest();
      scriptRequest.open('GET', scriptUrl);
      scriptRequest.onload = function(event) {
          var script = scriptRequest.responseText;
          script = script.replace(/![a-z].showLoginPaywall&&![a-z].showPaywall\|\|!1/g, 'true');

          document.open();
          document.write(html);
          document.close();

          var newScript = document.createElement('script');
          newScript.type = 'text/javascript';
          var textNode = document.createTextNode(script);
          newScript.appendChild(textNode);
          document.head.appendChild(newScript);
      }
      scriptRequest.send(null);
  }
  htmlRequest.send(null);
});