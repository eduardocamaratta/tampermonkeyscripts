// ==UserScript==
// @name         Masterchef Brasil Spoiler Protection
// @namespace    gmcamaratta
// @version      2.0
// @description  This script removes Masterchef spoilers from UOL and ClicRBS
// @author       Eduardo Camaratta
// @run-at       document-start
// @include      *://www.uol.com.br/*
// @include      *://www.clicrbs.com.br/*
// @exclude      *://www.clicrbs.com.br/jsp*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL  https://github.com/eduardocamaratta/tampermonkeyscripts/raw/master/MasterchefBrasilSpoilerProtection.user.js
// ==/UserScript==

(function() {
    'use strict';

    /* Masterchef Spoiler Removal */
    var msOverlayClass = "overlay";
    var msOverlayModalClass = "overlay-modal";
    var msLastWatchedDateKey = "mslastwatcheddatekey";

    var shouldExecuteMasterchefSpoilerRemoval = function() {
      // If today is not wednesday yet, or if it's wednesday, but before 1am
      var today = new Date();
      var watchedDate = GM_getValue(msLastWatchedDateKey);
      if(today.getDay() < 3 || today.getDay() == 3 && today.getHours() < 1) return false;
      if(!watchedDate) return true;
      var thisWeekEpisodeDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() - 3), 1, 0);
      return new Date(watchedDate) < thisWeekEpisodeDate;
    };

    var removeElement = function(e) {
      if(!e) return;
      e.parentNode.removeChild(e);
    };

    var insertMasterchefSpoilerProtection = function() {
      if(!shouldExecuteMasterchefSpoilerRemoval()) return;

      // This executes before load, so jquery is not available yet
      var after = function() {
        var body = document.getElementsByTagName('body')[0];
        var protectionCss = `
.overlay {
  z-index: 10000000;
  user-select: none;
  background-color: rgba(255, 255, 255, 0.99);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: verdana;
  font-size: 20px;
  text-align: center;
}

.overlay-modal {
  overflow: hidden;
  background-color: rgb(67, 75, 86);
  color: rgb(240, 240, 240);
  border: 1px solid #000;
  border-radius: 10px;
  box-shadow: 0px 1px 5px 1px rgba(0,0,0,0.5);
  width: 355px;  /* (20 + 60 + 5 + 250 + 20) */
  height: 100px; /* 20 + 60 + 20 */
  cursor: pointer;
}

.overlay-center {
  position: absolute;
  right: 50%;
  bottom: 50%;
  transform: translate(50%, 50%);
}

.overlay-spinner {
  position: absolute;
  height: 60px;
  width: 60px;
  top: 20px;
  left: 20px;
}

.overlay-spinner path {
  fill: rgb(240, 103, 31);
}

.overlay-text {
  position: absolute;
  top: 25px;
  left: 85px;
  width: 250px;
  line-height: 25px
}

.overlay-button {
  opacity: 0;
  padding-top: 5px;
  width: 100%;
}
.overlay-button-icon {
  height: 25px;
}
.overlay-button-label {
  vertical-align: top;
  display: inline-block;
}

.overlay-loaded {
  transition: 2s ease-out;
  background-color: rgba(255, 255, 255, 0);
}

.overlay-loaded .overlay-loading {
  transition: 0.5s;
  opacity: 0;
}

.overlay-loaded .overlay-button {
  transition: 1s ease-in;
  opacity: 1;
}

.overlay-modal-resize {
  transition: 0.5s ease-out;
  width: 160px;
  height: 40px;
}

.overlay-modal-resize .overlay-loading {
  display: none;
}

.overlay-modal-repos {
  transition: 0.5s ease-in-out;
  transform: none;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  bottom: 0;
  right: 20px;
}

.overlay-modal-repos:hover {
  background-color: rgb(42, 50, 61);
}

.overlay-modal-flash {
  width: 100%;
  height: 100%;
  background-color: white;
  opacity: 0;
}

.overlay-modal-flash-animation {
  animation-name: flash-modal;
  animation-duration: 0.75s;
}

@keyframes flash-modal {
  0% {opacity: 0;}
  5% {opacity: 1;}
  100% {opacity: 0;}
}`;
        var protectionStyle = document.createElement('style');
        protectionStyle.innerHTML = protectionCss;

        var innerHtml = `
<div class="overlay-modal overlay-center">
  <div class="overlay-loading">
    <svg class="overlay-spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
      <path d="M40,72C22.4,72,8,57.6,8,40C8,22.4,22.4,8,40,8c17.6,0,32,14.4,32,32c0,1.1-0.9,2-2,2s-2-0.9-2-2c0-15.4-12.6-28-28-28S12,24.6,12,40s12.6,28,28,28c1.1,0,2,0.9,2,2S41.1,72,40,72z">
        <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="0.7s" repeatCount="indefinite"/>
      </path>
    </svg>
    <span class="overlay-text" style="color: white !important">Protecting you from<br>Masterchef BR Spoilers</span>
  </div>

  <div class="overlay-button overlay-center">
    <svg class="overlay-button-icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path d="m508.18 246c-4.57-5.098-114.5-125-252.18-125s-247.61 119.9-252.18 125c-5.098 5.698-5.098 14.312 0 20.01 4.571 5.098 114.5 125 252.18 125s247.61-119.9 252.18-125c5.097-5.698 5.097-14.312 0-20.01zm-252.18 115c-57.891 0-105-47.109-105-105s47.109-105 105-105 105 47.109 105 105-47.109 105-105 105z" fill="#fff"/>
      <path d="m271 226c0-15.09 7.491-28.365 18.887-36.53-10.226-5.235-21.632-8.47-33.887-8.47-41.353 0-75 33.647-75 75s33.647 75 75 75c37.024 0 67.668-27.034 73.722-62.358-30.206 9.725-58.722-13.12-58.722-42.642z" fill="#fff"/>
    </svg>
    <span class="overlay-button-label" style="color: white !important">Watched</span>
  </div>

  <div class="overlay-modal-flash"></div>
</div>`;
        var protection = document.createElement('div');
        protection.innerHTML = innerHtml;
        protection.classList = msOverlayClass;

        body.insertBefore(protection, body.children[0]);
        body.insertBefore(protectionStyle, body.children[0]);

        document.querySelector(`.${msOverlayModalClass}`).onclick = function(event) {
          event.stopPropagation();
          document.querySelector('.overlay-modal-flash').classList += " overlay-modal-flash-animation";
          setTimeout(_ => {
            GM_setValue(msLastWatchedDateKey, new Date() + "");
            window.location.reload()
          }, 750);
        };
      };

      // This is executed in an interval to prevent the browser from crashing for excessive cpu usage
      var timer = setInterval(function() {
        if(document.getElementsByTagName('body').length > 0) {
          clearInterval(timer);
          after();
        }
      }, 5);
    };

    var animateOverlay = function() {
      document.querySelector(`.${msOverlayClass}`).classList += " overlay-loaded";
      setTimeout(_ => {
        document.querySelector(`.${msOverlayModalClass}`).classList += " overlay-modal-resize";
        setTimeout(_ => {
          document.querySelector(`.${msOverlayModalClass}`).classList += " overlay-modal-repos";
        }, 500);
      }, 500);
    }

    var removeMasterchefSpoilers = function() {
      if(!shouldExecuteMasterchefSpoilerRemoval()) {
        return;
      }
      var templinks = [].slice.call(document.getElementsByTagName('a'));
      [].slice.call(document.getElementsByTagName('a')).filter((a) => {return a.href.match(/masterchef/) || a.href.match(/tvefamosos/);}).forEach((e) => removeElement(e));

      animateOverlay();
    };

    /* Abort if running in an iframe */
    if (window.self != window.top) {
      return;
    }

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
        removeMasterchefSpoilers();
      }, 0);
    });

    /* Start */
    // We execute this before load, for obvious reasons
    insertMasterchefSpoilerProtection();
})();
