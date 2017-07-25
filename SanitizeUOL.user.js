// ==UserScript==
// @name         Sanitize UOL
// @namespace    gmcamaratta
// @version      1.0
// @description  Executes some cleaning procedures over UOL
// @author       Eduardo Camaratta
// @match        *://www.uol.com.br/*
// @run-at       document-start
// @grant        none
// @downloadURL  https://github.com/eduardocamaratta/tampermonkeyscripts/raw/master/SanitizeUOL.user.js
// ==/UserScript==

/*
 * This script executes the following procedures over UOL:
 * - Removes the tracker from links
 */

(function() {
    'use strict';

    /* Tracker Removal */
    var removeTracker = function() {
        var allLinks = $('a');
        allLinks.each(function(i, v) {
            if(v.href.startsWith("http://click.uol.com.br")) {
                v.href = v.href.replace(/^.*u=/, '');
            }
        });
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
            removeTracker();
        }, 0);
    });
})();
