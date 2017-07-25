// ==UserScript==
// @name         Redirect Itau Cinemas
// @namespace    gmcamaratta
// @version      1.0
// @description  Redirect the Itau Cinemas automatically
// @author       Eduardo Camaratta
// @match        *://www.itaucinemas.com.br/404.html
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.location.href = "http://www.itaucinemas.com.br/filmes";
})();