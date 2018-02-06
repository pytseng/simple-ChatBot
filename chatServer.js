/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;
var tea;
var ice;
var sugar;
var toppings;

//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hey, Hello I am \"bobabot\", feeling like drinking today?"); //We start with the introduction;
  setTimeout(timedQuestion, 2500, socket,"What is your Name?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;


/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  answer= 'Hello ' + input + ' :-)';// output response
  waitTime =2000;
  question = 'What kind of tea do you like?';			    	// load next question
  }
  else if (questionNum == 1) {
  answer= 'Wow ' + input + '!, classy ' ;// output response
  waitTime =2000;
  question = 'How would you like your ice';			    	// load next question
  tea = input.toLowerCase();
  }
  else if (questionNum == 2) {
  answer= ' gotcha, best for the temperature now isn\'t it? ';
  waitTime =2000;
  question = 'What about sugar? How much percentage?';			    	// load next question
  ice = input.toLowerCase();
  }
  else if (questionNum == 3) {
  sugar = input.toLowerCase();
  answer= 'Exactly ' + input+' percent for you!';
  // socket.emit('changeBG',input.toLowerCase());
  waitTime = 2000;
  question = 'Do you like any toppings such as bubbles or jelly? ';			    	// load next question
  }
  else if (questionNum == 4) {
    toppings = input.toLowerCase();
    if(input.toLowerCase()==='bubbles'|| input===1){
      answer = 'Boba life, huh?';
      waitTime =2000;
    }
    else if(input.toLowerCase()==='jelly'|| input===1){
        // socket.emit('changeFont','white'); /// we really should look up the inverse of what we said befor.
        answer = 'Jelly boy'
        question = '';
        waitTime = 0;
    }
    else if(input.toLowerCase()==='no'|| input===0){
        answer = 'Are you kidding me? no topping? Fine'
        question = '';
        waitTime = 0;
    }
    else {
      answer='We do not have this topping in store now, only bubbles and jelly are available.'
      question='';
      waitTime =1000;
      questionNum--;
    }
  // load next question
  }
  else if (questionNum == 5) {
    answer= 'This is your ' + tea +', ' + ice + ', '+ sugar + ' percent sugar, with ' + toppings;
    waitTime = 2000;
    question = '';
  }
  else{
    answer= 'Come next time!';// output response
    waitTime =0;
    question = '';
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
