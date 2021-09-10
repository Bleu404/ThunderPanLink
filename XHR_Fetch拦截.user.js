// ==UserScript==
// @name         XHR/Fetch拦截
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  XHR/Fetch拦截
// @author       bleu
// @match        https://pan.xunlei.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
   /* var oriXOpen = XMLHttpRequest.prototype.open;
    var oriXSend = XMLHttpRequest.prototype.send;
    //var oldonreadystatechange;
    var thisurl;

    function onReadyStateChangeReplacement() {
        if(thisurl.indexOf('xluser-ssl.xunlei.com')>=0){
            if (this.readyState == 4){
                if ( this.status == 200){
                    console.log( this.responseText);
                }
            }
        }
        if ( this._onreadystatechange) {
            return this._onreadystatechange.apply(this, arguments);
        }
    }
    XMLHttpRequest.prototype.open = function(method,url,asncFlag,user,password) {
        //code to trace or intercept
        thisurl = url;
        return oriXOpen.call(this,method,url,asncFlag,user,password);
    };
    XMLHttpRequest.prototype.send = function(data){
        if (this.onreadystatechange) {
             this._onreadystatechange = this.onreadystatechange;
        }
        this.onreadystatechange = onReadyStateChangeReplacement;
        return oriXSend.call(this, data);
    }*/

    const originFetch = fetch;
    Object.defineProperty(window, "fetch", {
        configurable: true,
        enumerable: true,
        // writable: true,
        get() {
            return (url,options) => {
                if(url.indexOf('https://api-pan.xunlei.com/drive/v1/files/VM')>=0){
                    console.log(options)
                }
                return originFetch(url,options)
            }
        }
    })
    // Your code here...
})();