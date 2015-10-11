
var app = require("express")();
var http = require("http").Server(app);
//socket.io will take care of sending clientside socket code to the client
var io = require("socket.io")(http);

//handle http requests to the website
app.get('/', function(req, res){
  res.sendFile('/home/ubuntu/workspace/' + 'frontend/index.html');
});

//handles socket client connection
io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('chat message', function(msg) {
      console.log("user says: " + msg);
      io.emit('chat message', msg);
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