
var app = require("express")();
var http = require("http").Server(app);
//socket.io will take care of sending clientside socket code to the client
var io = require("socket.io")(http);
var unirest = require('unirest');

//handle http requests to the website
app.get('/', function(req, res){
  res.sendFile('/home/ubuntu/workspace/' + 'frontend/index.html');
});

//this is a NASTY fix, i hate it
app.get('/main.css', function(req, res){
  res.sendFile('/home/ubuntu/workspace/' + 'frontend/main.css');
});

//handles socket client connection
io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('chat message', function(msg) {
      console.log(msg.name + " says: " + msg.message);
      //send message to be displayed on all connected clients (bad lol)
      io.emit('chat message', msg);
      
      //send message to chatbot for processing
      //first make the request to the chatbot using unirest
      
      // unirest.get('http://api.program-o.com/v2.3.1/chatbot/')
      //   .field()
      
      
      //crunch message from chatbot using sentiment analasys
      
      //get gif based on sentiment analasys results
  });
  
  //what to do when a socket disconnects 
  //TODO: make the chat clear once someone disconnects
  socket.on('disconnect', function(){
    console.log('a user disconnected');
  });
});

//makes http listen on the specified port (right now its just the enviornment varible)
http.listen(process.env.PORT, function(){
  console.log("listening on" + process.env.PORT);
});