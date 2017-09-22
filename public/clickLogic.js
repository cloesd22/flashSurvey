import {serverPOST,serverGET} from './xhttpFunctions.js';

function winload(){

	var button = document.getElementById("thebutton").addEventListener("click", ()=>{

		console.log("buttonclicked");
		
		serverPOST('/push',(res)=>{
			console.log(res);
			
			var currentCount = JSON.parse(res).value;
			document.getElementById("counter").innerHTML="Counter: "+currentCount;
			
			
		},'')
	})

}

window.onload = winload;