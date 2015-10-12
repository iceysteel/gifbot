
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
      
      unirest.get('http://demo.program-o.com/b0tco/get_response.php')
         .query({'say' : msg.message})
         //.query({'bot_id' : 1})
         .query({'convo_id' : msg.name})
         .end(function(res){
           //if something bad happened break and send an error message back to the client
           var parsed = JSON.parse(res.body);
           if(res.error || ~res.body.indexOf('<') || ~parsed.botsay.indexOf('Error') ){
             console.log("there was a problem b0ss :", res.error);
             io.emit('chat message', {name: 'system', message: 'there was an error, try sending again'} );
             
           } else {
             console.log("yeee we got a response:", parsed.botsay);
             
             crunchSentiment(parsed.botsay, msg.name);
           }
         });
      
      
      //crunch message from chatbot using sentiment analasys
      function crunchSentiment(botreply, username){
        
        
      }
      
      //get gif based on sentiment analasys results
      
      //attach gif to message and send it to be free (go fly my creation SPREAD YOUR WINGS)
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