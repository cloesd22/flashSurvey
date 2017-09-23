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

	var forButton = document.getElementById("forButton").addEventListener("click", ()=>{

		console.log("forButtonClicked");

		
		Object(__WEBPACK_IMPORTED_MODULE_0__xhttpFunctions_js__["a" /* serverPOST */])('/pushFor',(res)=>{
			var serverResponse = JSON.parse(res);
			console.log("vasl"+serverResponse);
			var currentCount = serverResponse.value;
			var dateObject = (formatDateSince(serverResponse.currentTime,serverResponse.date));
			document.getElementById("counter").innerHTML="Votes: "+currentCount;
			document.getElementById("counterSubtext").innerHTML=`Last vote was ${dateObject.value} ${dateObject.name} ago from ${serverResponse.loc}.`;
			document.getElementById("currentFor").innerHTML=`For: ${serverResponse.for}`;
			document.getElementById("currentAgainst").innerHTML=`Against: ${serverResponse.against}`;

		},'')
	})

	var againstButton = document.getElementById("againstButton").addEventListener("click", ()=>{

		console.log("AgainstButtonClicked");
		
		Object(__WEBPACK_IMPORTED_MODULE_0__xhttpFunctions_js__["a" /* serverPOST */])('/pushAgainst',(res)=>{
			var serverResponse = JSON.parse(res);

			console.log("vasl"+serverResponse);
			var currentCount = serverResponse.value;
			var dateObject = (formatDateSince(serverResponse.currentTime,serverResponse.date));
			document.getElementById("counter").innerHTML="Votes: "+currentCount;
			document.getElementById("counterSubtext").innerHTML=`Last vote was ${dateObject.value} ${dateObject.name} ago from ${serverResponse.loc}.`;
			document.getElementById("currentFor").innerHTML=`For: ${serverResponse.for}`;
			document.getElementById("currentAgainst").innerHTML=`Against: ${serverResponse.against}`;

		},'')
	})




	var showButton = document.getElementById("showResults").addEventListener("click", ()=>{

		if(document.getElementById("currentResults").style.visibility=='hidden'){

			document.getElementById("currentResults").style.visibility='visible';
			document.getElementById("showResults").innerHTML = "Hide Results";
		}else{

			document.getElementById("currentResults").style.visibility='hidden';
			document.getElementById("showResults").innerHTML = "Show Results"
		}
		
	});


}

window.onload = winload;

function formatDateSince(currentServerTime,dateDifference){
	//takes in dateNow value (miliseconds) and returns
	//either seconds,minutes,hours,days etc if that value is > 2.

	function convertSeconds(dateValue){
		return dateValue/1000;
	}

	var seconds = (convertSeconds(Date.now())-dateDifference/1000)
	var minutes = seconds/60;
	var hours = minutes/60;
	var days = hours/60;

	var ElementArray = [
	{name:"Seconds",value:seconds},
	{name:"Minutes",value:minutes},
	{name:"Hours",value:hours},
	{name:"Days",value:days}
	];

	var dateValue = ElementArray[0].value; 
	var formattedDate = ElementArray[0];

	for(var x = 1; x < ElementArray.length;x++){

		if((ElementArray[x].value < dateValue)&&(ElementArray[x].value>2)){
			formattedDate = ElementArray[x];		
		}
	}

	formattedDate.value = Math.floor(formattedDate.value);
	return formattedDate;
}

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