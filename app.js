//Presents a button
//counts clicks to the button.

//future
//presents two buttonscounts both clicks
//buttons represent options
//graphs results in real time
//counts participants
//ability to create binary X-many real time options

const express = require('express');
const axios = require('axios');
const hbs = require('hbs');
const dd = require('ddos');
var gl = require('geoip-lite');


var ddos = new dd({burst:10,limit:25})
var app = express();
app.use(ddos.express);

var currentcount = {value:0};
const port = process.env.PORT || 3001;
//setup
app.use(express.static(__dirname + '/public'));
app.set('view engine','hbs');


//responses
app.get('/',(req,res)=>{

	axios.get('https://btnproject-eef7a.firebaseio.com/counter.json').then((resp)=>{

		
		var latestValue = resp.data.value;
		var lastButtonDate = formatDateSince(resp.data.date);
		var latestDate = resp.data.date;
		res.render('thebutton.hbs',{currentcount:latestValue,date:latestDate, dateInital:lastButtonDate});

	});
	
	
})

app.post('/push',(req,res)=>{

	getandIncrement(req,res,1);
	
})

app.get('/hello',(req,res)=>{
	axios.put('https://btnproject-eef7a.firebaseio.com/counter.json',{value:0,date:Date.now()}).then((resp)=>{

	})
})


var getandIncrement = (req,res,data)=>{
	//gets increments by argument and returns value. 
	//first argument is the response object, that has method .send to send to response.
	axios.get('https://btnproject-eef7a.firebaseio.com/counter.json').then((resp)=>{

		var latestValue = resp.data.value;
		latestValue = latestValue +data;
		latestDate = resp.data.date;
		var ipGuest = req.headers['x-forwarded-for'];

		

		
		var geo = gl.lookup(ipGuest);

		if(!geo){
			geo = "Unknown Location"
		}

		axios.put('https://btnproject-eef7a.firebaseio.com/counter.json',{value:latestValue,date:Date.now()}).then((resp)=>{

		}).then(()=>{
			res.send({value:latestValue,date:latestDate,currentTime:Date.now(),loc:geo});
		})
	});
}

/*app.get('/*',(req,res)=>{
	res.send('Wer u goin boiss?');
})
*/


function formatDateSince(dateDifference){
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



app.listen(port);