  // ==UserScript==
  // @name         Masterchef Brasil Spoiler Protection
  // @namespace    gmcamaratta
  // @version      1.1.1
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
      var msSpoilerProtectClass = "msspoilerprotection";
      var msSpoilerProtectDisableId = "msspoilerprotectiondisable";
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
        if(!shouldExecuteMasterchefSpoilerRemoval()) {
          return;
        }

        // This executes before load, so jquery is not available yet
        var after = function() {
          var innerHtml = "<div class='" + msSpoilerProtectClass + "' style='position: fixed; z-index: 10000000; left: 0; top: 0; height: 100%; width: 100%; background-color: rgba(255, 255, 255, 0.99);'>" +
                            "<span style='display: block; position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; font-size: 30px; font-weight: bold'>" + 
                              "Protecting you from masterchef spoilers..." +
                              "<span style='display: block; font-size: 20px; font-style: italic'>Click to remove</span>" +
                              "<div id='" + msSpoilerProtectDisableId + "' style='max-width: 200px; border-radius: 10px; background-color: red; color: white; border: 3px solid #800000; margin-top: 50px; padding: 5px; position: relative; left: 50%; transform: translateX(-50%);'>Já assisti</div>" +
                            "</span>" +
                          "</div>";
          var protection = document.createElement('div');
          protection.innerHTML = innerHtml;
          protection.onclick = function(e) {removeElement(this);};

          var body = document.getElementsByTagName('body')[0];
          body.insertBefore(protection, body.children[0]);

          var watched = document.getElementById(msSpoilerProtectDisableId);
          watched.onclick = function(e) {
            e.stopPropagation();
            var protection = document.getElementsByClassName("msspoilerprotection")[0];
            GM_setValue(msLastWatchedDateKey, new Date() + "");
            removeElement(protection);
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

      var removeMasterchefSpoilers = function() {
        if(!shouldExecuteMasterchefSpoilerRemoval()) {
          return;
        }
        var templinks = [].slice.call(document.getElementsByTagName('a'));
        [].slice.call(document.getElementsByTagName('a')).filter((a) => {return a.href.match(/masterchef/) || a.href.match(/tvefamosos/);}).forEach((e) => removeElement(e));
        var elements = [].slice.call(document.getElementsByClassName(msSpoilerProtectClass));
        elements.forEach((e) => removeElement(e));
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
