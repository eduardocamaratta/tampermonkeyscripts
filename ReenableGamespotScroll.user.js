// ==UserScript==
// @name         Reenable Gamespot Scroll
// @namespace    gmcamaratta
// @version      2.1
// @description  Remove classes which disables the scroll in Gamespot pages
// @author       You
// @include      https://www.gamespot.com/*
// @grant        none
// @downloadURL  https://github.com/eduardocamaratta/tampermonkeyscripts/raw/master/ReenableGamespotScroll.user.js
// ==/UserScript==

(function() {
  'use strict';

  const removeOverlays = function() {
    setInterval(function() {
      ['fb_digioh-lock', 'fb_lightbox-margin', 'fb_lightbox-lock'].map(className => {
        document.querySelectorAll(`.${className}`).forEach(el => el.classList.remove(className));
      });
    }, 250);
  };

  if (window.addEventListener){
    window.addEventListener('load', removeOverlays);
  } else {
    window.attachEvent('onload', removeOverlays);
  }
})();
