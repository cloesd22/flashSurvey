//Presents a button
//counts clicks to the button.

//future
//Move Repo to private storage
//buttons represent options
//graphs results in real time

const express = require('express');
const hbs = require('hbs');
const dd = require('ddos');
const gl = require('geoip-lite');
const uid = require('uniqid');

var dba = require('./firebaseDatabaseAP.js');



//-------------------Setup-------------------------//
var ddos = new dd({ burst: 3, limit: 3 })
var app = express();
db = new dba.FirebaseDBAAP('logs');
dbC = new dba.FirebaseDBAAP('counter');

app.set('view engine', 'hbs');
app.use('/pushFor', ddos.express);
app.use('/pushAgainst', ddos.express);
app.use(express.static(__dirname + '/public'));
const port = process.env.PORT || 3001;

var latestCount;

function updateLatestCount(value){
	latestCount = value;
}

dbC.addChangeListener(updateLatestCount).then((results) => {
	console.log("Database Listener Connected");
}).catch((err)=>{
	console.log("Database Listener failed to connect -" + err);
})

//-------------------Routes-------------------------//
app.get('/', (req, res) => {

	var geo = getloc(null, latestCount.loc, "city");
	
	res.render('thebutton.hbs', {
		currentcount: latestCount.value,
		date: latestCount.date,
		dateInital: formatDateSince(latestCount.date),
		loc: geo,
		for: latestCount.for,
		against: latestCount.against
	});

})


app.post('/pushFor', (req, res) => {

	var userIP = getUserIP(req);
	var pushStatus = "Not pushed";

	checkLogsForPreviousUser(userIP).then(() => {

		getandIncrement(req, res, true).then(() => {
			logUserData(req, 1);
			pushStatus = "Success";
		}).catch((err) => {
			console.log("Push for Failed");
			pushStatus = "Failed";
		})

	}).catch((error) => {
		pushStatus = "Non-unique";
		res.send(pushStatus);
	});
});

app.post('/pushAgainst', (req, res) => {

	var userIP = getUserIP(req);
	var pushStatus = "Not pushed";

	checkLogsForPreviousUser(userIP).then(() => {

		getandIncrement(req, res, false).then(() => {
			logUserData(req, 0);
			pushStatus = "Success";
		}).catch((err) => {
			console.log("Push for Failed");
			pushStatus = "Failed";
		});

	}).catch((error) => {
		pushStatus = "Non-unique";
		res.send(pushStatus);
	})
})

app.get('/reset', (req, res) => {
	//resets the voting

	var defaultVotes = {
		value: 0,
		date: Date.now(),
		loc: "115.64.64.83",
		for: 0,
		against: 0
	};

	var defaultLogs = {};

	dbC.OverwriteSPEC(defaultVotes).then(()=>{
		console.log("Wiping all votes");
	}).catch((err) => {
		console.log("Failed to wipe votes -" + err);
	})

	db.OverwriteSPEC(defaultLogs).then(()=>{
		console.log("Wiping all logs");
	}).catch((err) => {
		console.log("Failed to wipe logs -" + err);
	})


})

app.get('/*', (req, res) => {
	res.render('errorPage.hbs');
});

//-------------------Functional elements -------------------------//

function sendVote(res, vote, datapackage) {

	var geo = getloc(null, datapackage.latestIP, "city");

	if(!datapackage.loc){
		datapackage.loc = "192.168.1.6";
	}

	var data = {value: datapackage.value,
				date: Date.now(),
				loc: datapackage.loc,
				for: datapackage.for + vote.for,
				against: datapackage.against + vote.against}

	

	dbC.OverwriteSPEC(data).then((result) => {
		res.send({
			value: datapackage.value,
			date: datapackage.date,
			currentTime: Date.now(),
			loc: geo,
			for: datapackage.for + vote.for,
			against: datapackage.against + vote.against
		})
	}).catch((err)=>{
		console.log("Error incrementing Counter! -"+ err);
	})

}



var getandIncrement = (req, res, vote) => {
	//gets increments by argument and returns value. 
	//first argument is the response object, that has method .send to send to response.
	return new Promise((resolve, reject) => {

		var ipGuest = getUserIP(req);
		var datapackage =
			{
				'value': (latestCount.value||0) + 1,
				'date': latestCount.date,
				'latestIp': latestCount.loc,
				'loc': ipGuest,
				'for': latestCount.for || 0,
				'against': latestCount.against || 0
			}

		vote = vote == 1 ? { for: 1, against: 0 } : { for: 0, against: 1 };
		sendVote(res, vote, datapackage)
		resolve();
	}) 
}



function getloc(req, ip, property) {
	//return location from IP.
	if (req) {
		var ipGuest = getUserIP(req);
	} else {
		var ipGuest = ip;
	}

	if (ip == null) {
		return geo = "an Unknown Location";
	}

	var geo = gl.lookup(ipGuest);


	if (geo == null ||
		geo[property] == null ||
		geo[property].length < 1) {
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

	
	db.CreateSPEC({'userIP':userIP,'vote':vote}).then((data)=>{
		console.log(`Data logged: User: ${userIP}, Vote: ${vote}`);
	}).catch((err)=>{
		console.log("Error posting in log user data -" + err);
	})
}

function getLogs() {
	//retrieve logs array from database:
	return new Promise((resolve, reject) => {

		db.ReadALLRT().then((data)=>{
			resolve(data)
        }).catch((err)=>{
			reject("error getting logs - "+ err);
		});

	})
}

var checkLogsForPreviousUser = (userIP) => {
	//return resolve if IP doesn't match any IP's inside the current logs
	//else reject
	return new Promise((resolve, reject) => {

		db.ReadSPEC('userIP',userIP).then((data) => {
			if (data == "empty") {
				console.log("No duplicates found!")
				resolve();
			} else {
				reject();
				console.log("duplicates found!")
			}
		})
	})
}

function getUserIP(req) {
	// retrieve user IP from req object
	// Build this function to be more accurate/use more sources.
	var ip = req.headers['x-forwarded-for'];
	return ip;
}

function formatDateSince(dateDifference) {
	//takes in dateNow value (miliseconds) since 1970 and returns
	//either seconds,minutes,hours,days etc if that value is > 2.

	var seconds = (Date.now() - dateDifference) / 1000;
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

//-------------------Testing Exports-------------------------//
module.exports = {
	formatDateSince,
	getUserIP,
	checkLogsForPreviousUser,
	getLogs,
	logUserData,
	getloc,
	getandIncrement
}
