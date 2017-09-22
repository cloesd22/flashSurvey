/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__xhttpFunctions_js__ = __webpack_require__(1);


function winload(){

var button = document.getElementById("thebutton").addEventListener("click", ()=>{
	console.log("buttonclicked");

	Object(__WEBPACK_IMPORTED_MODULE_0__xhttpFunctions_js__["a" /* serverPOST */])('/push',(res)=>{
		var currentCount = JSON.parse(res).value;
		document.getElementById("counter").innerHTML="Counter: "+currentCount;

	},'')

})

}

window.onload = winload;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export serverGET */
/* harmony export (immutable) */ __webpack_exports__["a"] = serverPOST;
function serverGET(url, callback){
//performs an AJAX GET request from the server
//inputs: request url, callback, returns data
    var serverResponse;
    

    if (window.XMLHttpRequest){
        var requestObject = new XMLHttpRequest();
    }else{
        var requestObject = new ActiveXObject("Microsoft.XMLHTTP");
    }

    requestObject.onreadystatechange = function(){

        if (requestObject.readyState==4 & requestObject.status==200){
            
            requestObject.onload=function(){
                serverResponse = requestObject.responseText;
                if (callback) callback(serverResponse);    
            }

        }
    }

    requestObject.open('GET',url,true);
    requestObject.send();

    return 'Test Success';
}


function serverPOST (url, callback,data){
//performs an AJAX POST request to the server
//inputs: request url, callback, data to send
    var serverResponse;
    

    if (window.XMLHttpRequest){
        var requestObject = new XMLHttpRequest();
    }else{
        var requestObject = new ActiveXObject("Microsoft.XMLHTTP");
    }

    requestObject.onreadystatechange = function(){

        if (requestObject.readyState==4 & requestObject.status==200){
            requestObject.onload=function(){
                serverResponse = requestObject.responseText;
                if (callback) callback(serverResponse);
            }

        }
    }

    requestObject.open('POST',url,true);
    requestObject.send(data);

    return 'Test Success';
}



/***/ })
/******/ ]);