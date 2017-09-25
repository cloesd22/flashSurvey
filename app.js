//Presents a button
//counts clicks to the button.

//future
//counts participants(done)
//presents two buttonscounts both clicks(done)

//rate limitter based on path. ie; you can refresh any amount of times, but only 1 vote.
//Move Repo to private storage
//buttons represent options
//graphs results in real time

const express = require('express');
const axios = require('axios');
const hbs = require('hbs');
const dd = require('ddos');
const gl = require('geoip-lite');
const uid = require('uniqid');





var ddos = new dd({ burst: 1, limit: 1 })
var app = express();

app.use('/pushFor', ddos.express);
app.use('/pushAgainst', ddos.express);


const port = process.env.PORT || 3001;
//setup
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');


//responses
app.get('/', (req, res) => {

	axios.get('https://btnproject-eef7a.firebaseio.com/counter.json').then((resp) => {


		var latestValue = resp.data.value;
		var lastButtonDate = formatDateSince(resp.data.date);
		var latestDate = resp.data.date;
		var latestIP = resp.data.loc;
		var currentFor = resp.data.for;
		var currentAgainst = resp.data.against;
		var geo = getloc(null, latestIP, "city");

		res.render('thebutton.hbs', {
			currentcount: latestValue,
			date: latestDate,
			dateInital: lastButtonDate,
			loc: geo,
			for: currentFor,
			against: currentAgainst
		});
	}).catch((err) => {
		console.log("Error getting base file data -" + err);
	});


})

app.get('/error', (req,res)=>{
	res.render('errorPage.hbs');
});


app.post('/pushFor', (req, res) => {

	var userIP = getUserIP(req);
	var pushStatus = "Not pushed";

	checkLogsForPreviousUser(userIP).then((result) => {
		if (result) {

			getandIncrement(req, res, 1, true).then(() => {
				logUserData(req, 1);
			}).then(() => {
				pushStatus = "success";
			}).catch((err) => {
				console.log("Push for Failed");
				pushStatus = "Failed";
			})


		} else {

			pushStatus = "Non-unique";
			res.send(pushStatus);
		}
	})

})

app.post('/pushAgainst', (req, res) => {

	var userIP = getUserIP(req);
	var pushStatus = "Not pushed";

	checkLogsForPreviousUser(userIP).then((result) => {
		if (result) {

			getandIncrement(req, res, 1, false).then(() => {
				logUserData(req, 0);
			}).then(()=>{
				pushStatus = "success";
			}).catch((err) => {
				console.log("Push for Failed");
				pushStatus = "Failed";
			});
		
		} else {

			pushStatus = "Non-unique";
			res.send(pushStatus);
		}
	})
















})

app.get('/hello', (req, res) => {
	//resets the voting

	var defaultVotes = {
		value: 0,
		date: Date.now(),
		loc: "115.64.64.83",
		for: 0,
		against: 0
	};

	axios.put('https://btnproject-eef7a.firebaseio.com/counter.json', defaultVotes).catch((err) => {
		console.log("Error Putting /hello seed -" + err);
	});

})


var getandIncrement = (req, res, data, vote) => {
	//gets increments by argument and returns value. 
	//first argument is the response object, that has method .send to send to response.
	return new Promise((resolve, reject) => {
		axios.get('https://btnproject-eef7a.firebaseio.com/counter.json').then((resp) => {

			var latestValue = resp.data.value;
			latestValue = latestValue + data;
			latestDate = resp.data.date;
			latestIP = resp.data.loc;
			currentFor = resp.data.for || 0;
			currentAgainst = resp.data.against || 0;

			//var ipGuest = req.headers['x-forwarded-for'];
			var ipGuest = getUserIP(req);

			var geo = getloc(null, latestIP, "city");


			if (vote == true) {

				axios.put('https://btnproject-eef7a.firebaseio.com/counter.json', { value: latestValue, date: Date.now(), loc: ipGuest, for: currentFor + 1, against: currentAgainst }).then(() => {
					res.send({
						value: latestValue,
						date: latestDate,
						currentTime: Date.now(),
						loc: geo,
						for: currentFor + 1,
						against: currentAgainst
					});
				}).catch((err) => {
					console.log("Error Sending getandIncrement YesVote data -" + err);
					reject();
				})
			} else {
				axios.put('https://btnproject-eef7a.firebaseio.com/counter.json', { value: latestValue, date: Date.now(), loc: ipGuest, for: currentFor, against: currentAgainst + 1 }).then(() => {
					res.send({
						value: latestValue,
						date: latestDate,
						currentTime: Date.now(),
						loc: geo,
						for: currentFor,
						against: currentAgainst + 1
					});
				}).catch((err) => {
					console.log("Error Sending getandIncrement NoVote data -" + err);
					reject();
				})
			}
		}).then((data) => {
			resolve();
		}).catch((err) => {
			console.log("Error Getting getandIncrement data -" + err);
			reject();
		});
	})
}



function getloc(req, ip, property) {

	if (req) {
		var ipGuest = getUserIP(req);
	} else {
		var ipGuest = ip;
	}

	if (ip == null) {
		return geo = "an Unknown Location";
	}

	var geo = gl.lookup(ipGuest);


	if (geo[property] === null) {
		geo = "an Unknown Location"

		return geo;
	}
	return geo[property];


	/*properties example:
	{range: [ 3479297920, 3479301339 ],
	country: 'US',
	region: 'TX',
	city: 'San Antonio',
		ll: [ 29.4889, -98.3987 ],
	metro: 641,
	zip: 78218 }*/

}


function logUserData(req, vote) {
	// Take current request headers and create table entry:
	// user ip, time, vote.
	var userIP = getUserIP(req);


	if (!userIP) {
		//if userIP cannot be resolved it generates a unique code for the user.
		//this allows the multiple Unidentified IPs to continue voting.
		userIP = "Unknown" + uid();
	}

	var data = { userIP: userIP, vote: vote }
	axios.post('https://btnproject-eef7a.firebaseio.com/logs.json', data).then((resp) => {
		console.log(`Data logged: User: ${userIP}, Vote: ${vote}`);
	}).catch((err) => {
		console.log("Error posting in log user data -" + err);
	});
}

function getLogs() {

	return new Promise((resolve, reject) => {
		var logsObject;
		//retrieve logs array fromd atabase:
		axios.get('https://btnproject-eef7a.firebaseio.com/logs.json').then((data) => {
			logsObject = data;
			resolve(data);
		}).catch((error) => {
			console.log("error retrieving logs - " + error);
			reject();
		})
	})
}

function checkLogsForPreviousUser(userIP) {
	//get logs then check the logs file if the specified IP already exists.
	//If so return false, else return true.
	return new Promise((resolve, reject) => {
		var unique = true;
		getLogs().then((data) => {
			if (data.data) {
				jsonForEach(data, (elem) => {
					if (elem.userIP == userIP) {
						console.log(elem.userIP + " matches with " + userIP + "Insert failed");
						unique = false;
						resolve(unique);
					}

				})
			}
		}).catch((error) => {
			console.log("getLogs failed! - " + error);
			reject();
		})
		resolve(unique);
	})


}

function getUserIP(req) {
	// retrieve user IP from req object
	// Build this function to be more accurate/use more sources.
	var ip = req.headers['x-forwarded-for'];
	return ip;
}

function jsonForEach(object, callback) {
	//takes in a JSON object, iterates through it.

	Object.keys(object.data).forEach((element) => {
		callback(object.data[element]);
	})



}



function formatDateSince(dateDifference) {
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



app.listen(port);