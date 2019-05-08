// ==UserScript==
// @name         Reenable Gamespot Scroll
// @namespace    gmcamaratta
// @version      1.1
// @description  Remove classes which disables the scroll in Gamespot pages
// @author       You
// @include      https://www.gamespot.com/*
// @grant        none
// @downloadURL  https://github.com/eduardocamaratta/tampermonkeyscripts/raw/master/ReenableGamespotScroll.user.js
// ==/UserScript==

(function() {
  'use strict';

  var main = function() {
    $('.fb_digioh-lock').removeClass('fb_digioh-lock');
    $('.fb_lightbox-margin').removeClass('fb_lightbox-margin');
    $('.fb_lightbox-lock').removeClass('fb_lightbox-lock');
  };

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

  // Multiple scripts can be adding callbacks to onload, add this callback in a safe manner
  addLoadEvent(function() {
    setTimeout(function() {
      main();
    }, 0);
  });
})();