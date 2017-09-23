import {serverPOST,serverGET} from './xhttpFunctions.js';

function winload(){

	var button = document.getElementById("forButton").addEventListener("click", ()=>{

		console.log("buttonclicked");
		
		serverPOST('/push',(res)=>{
			var serverResponse = JSON.parse(res);
			var currentCount = serverResponse.value;
			var dateObject = (formatDateSince(serverResponse.currentTime,serverResponse.date));
			document.getElementById("counter").innerHTML="Counter: "+currentCount;
			document.getElementById("counterSubtext").innerHTML=`It was last clicked ${dateObject.value} ${dateObject.name} ago from ${serverResponse.loc}.`;

		},'')
	})

	var button = document.getElementById("againstButton").addEventListener("click", ()=>{

		console.log("buttonclicked");
		
		serverPOST('/push',(res)=>{
			var serverResponse = JSON.parse(res);
			var currentCount = serverResponse.value;
			var dateObject = (formatDateSince(serverResponse.currentTime,serverResponse.date));
			document.getElementById("counter").innerHTML="Counter: "+currentCount;
			document.getElementById("counterSubtext").innerHTML=`It was last clicked ${dateObject.value} ${dateObject.name} ago from ${serverResponse.loc}.`;

		},'')
	})

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