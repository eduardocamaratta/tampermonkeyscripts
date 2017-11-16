// ==UserScript==
// @name         Kotaku Anti-Anti AdBlock
// @namespace    gmcamaratta
// @version      1.0
// @description  Disable the annoying anti-adblock from Kotaku
// @author       Eduardo Camaratta
// @include      *://kotaku.com/*
// @grant        none
// @downloadURL  https://github.com/eduardocamaratta/tampermonkeyscripts/raw/master/KotakuAntiAntiAdBlock.user.js
// ==/UserScript==

(function() {
  'use strict';

  /* Load */
  var addLoadEvent = function(newLoadEvent) {
    var oldOnLoad = window.onload;
    if(typeof window.onload != 'function') {
      window.onload = newLoadEvent;
    } else {
      window.onload = function() {
        if (oldOnLoad) {
          oldOnLoad();
        }
        newLoadEvent();
      };
    }
  };

  var main = function() {
    $('[style="display: block;"]').remove();
    $('body, html').removeAttr('style');
  };

  // Multiple scripts can be adding callbacks to onload, add this callback in a safe manner
  addLoadEvent(function() {
    setTimeout(function() {
      main();
    }, 0);
  });
})();