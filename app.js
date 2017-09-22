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


var app = express();
var currentcount = {value:0};
const port = process.env.PORT || 3000;
//setup
app.use(express.static(__dirname + '/public'));
app.set('view engine','hbs');


//responses
app.get('/',(req,res)=>{
	res.render('thebutton.hbs',currentcount);
	
})

app.post('/push',(req,res)=>{

	getandIncrement(res,1);
	
})

app.get('/hello',(req,res)=>{
	axios.put('https://btnproject-eef7a.firebaseio.com/counter.json',{value:0}).then((resp)=>{

	})
})


var getandIncrement = (res,data)=>{
	//gets increments by argument and returns value. 
	//first argument is the response object, that has method .send to send to response.

	axios.get('https://btnproject-eef7a.firebaseio.com/counter.json').then((resp)=>{

		console.log(resp.data.value);
		var latestValue = resp.data.value;
		latestValue = latestValue +data;

		axios.put('https://btnproject-eef7a.firebaseio.com/counter.json',{value:latestValue}).then((resp)=>{

		}).then(()=>{
			console.log("aymen"+latestValue)
			res.send({value:latestValue});
		})
	});
}

/*app.get('/*',(req,res)=>{
	res.send('Wer u goin boiss?');
})
*/



app.listen(port);