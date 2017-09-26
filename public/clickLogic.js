import { serverPOST, serverGET } from './xhttpFunctions.js';

function winload() {

	var forButton = document.getElementById("forButton").addEventListener("click", () => {

		console.log("forButtonClicked");


		serverPOST('/pushFor', (res) => {

			console.log(res);
			try {
				var serverResponse = JSON.parse(res);

				var currentCount = serverResponse.value;
				var dateObject = (formatDateSince(serverResponse.currentTime, serverResponse.date));
				document.getElementById("counter").innerHTML = "Votes: " + currentCount;
				document.getElementById("counterSubtext").innerHTML = `Last vote was ${dateObject.value} ${dateObject.name} ago from ${serverResponse.loc}.`;
				document.getElementById("currentFor").innerHTML = `For: ${serverResponse.for}`;
				document.getElementById("currentAgainst").innerHTML = `Against: ${serverResponse.against}`;
			} catch (error) {

				document.getElementById("errormsg").innerHTML = "You've already Voted!";
				document.getElementById("errormsg").style.visibility = 'visible';
				document.getElementById("forButton").disabled = true;
				document.getElementById("againstButton").disabled = true;
			}
		}, '')
	})

	var againstButton = document.getElementById("againstButton").addEventListener("click", () => {

		console.log("AgainstButtonClicked");
		serverPOST('/pushAgainst', (res) => {


			try {
				var serverResponse = JSON.parse(res);

				var currentCount = serverResponse.value;
				var dateObject = (formatDateSince(serverResponse.currentTime, serverResponse.date));
				document.getElementById("counter").innerHTML = "Votes: " + currentCount;
				document.getElementById("counterSubtext").innerHTML = `Last vote was ${dateObject.value} ${dateObject.name} ago from ${serverResponse.loc}.`;
				document.getElementById("currentFor").innerHTML = `For: ${serverResponse.for}`;
				document.getElementById("currentAgainst").innerHTML = `Against: ${serverResponse.against}`;
			} catch (error) {
				document.getElementById("errormsg").innerHTML = "You've already Voted!";
				document.getElementById("errormsg").style.visibility = 'visible';
				document.getElementById("forButton").disabled = true;
				document.getElementById("againstButton").disabled = true;
			}

		}, '')
	})


	var showButton = document.getElementById("showResults").addEventListener("click", () => {

		if (document.getElementById("currentResults").style.visibility == 'hidden') {

			document.getElementById("currentResults").style.visibility = 'visible';
			document.getElementById("showResults").innerHTML = "Hide Results";
		} else {

			document.getElementById("currentResults").style.visibility = 'hidden';
			document.getElementById("showResults").innerHTML = "Show Results"
		}

		document.getElementById("showResults").blur();

	});


}

window.onload = winload;

function formatDateSince(currentServerTime, dateDifference) {
	//takes in dateNow value (miliseconds) and returns
	//either seconds,minutes,hours,days etc if that value is > 2.

	function convertSeconds(dateValue) {
		return dateValue / 1000;
	}

	var seconds = (convertSeconds(Date.now()) - dateDifference / 1000)
	var minutes = seconds / 60;
	var hours = minutes / 60;
	var days = hours / 60;

	var ElementArray = [
		{ name: "Seconds", value: seconds },
		{ name: "Minutes", value: minutes },
		{ name: "Hours", value: hours },
		{ name: "Days", value: days }
	];

	var dateValue = ElementArray[0].value;
	var formattedDate = ElementArray[0];

	for (var x = 1; x < ElementArray.length; x++) {

		if ((ElementArray[x].value < dateValue) && (ElementArray[x].value > 2)) {
			formattedDate = ElementArray[x];
		}
	}
	formattedDate.value = Math.floor(formattedDate.value);
	return formattedDate;
}

