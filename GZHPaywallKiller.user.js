// ==UserScript==
// @name         GZH Paywall Killer
// @namespace    gmcamaratta
// @version      1.0.6
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

let altScriptPath        = "https://cdn.rawgit.com/eduardocamaratta/tampermonkeyscripts/f4ecda36/js/main.1.42.0.min.js";
let altSpecialScriptPath = "https://cdn.rawgit.com/eduardocamaratta/tampermonkeyscripts/407eefcc/js/special-paywall.min.js";

(function() {
  window.stop();
  var htmlRequest = new XMLHttpRequest();

  htmlRequest.open('GET', location.href);
  htmlRequest.onload = function(event) {
    var html = htmlRequest.responseText.replace(/<script[^m]+main[^j]+js[^\/]+\/[^\>]+\>/, '<script src="' + altScriptPath + '"></script>');
    html = html.replace(/http.*special-paywall.*\.js/, altSpecialScriptPath);

    document.open();
    document.write(html);
    document.close();
  };
  htmlRequest.send(null);
})();