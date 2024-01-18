const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
app.use(express.static(path.join(__dirname, '/public')));
const io = require('socket.io')(server);
    io.on('connection', function(socket) {
        socket.on('newuser', function(username) {
            
            socket.broadcast.emit('update', username + "joined the chat");
        });
        socket.on('exituser', function(username) {
            
            socket.broadcast.emit('update', username + "left the chat");
        });
        socket.on('chat', function(msg) {
            socket.broadcast.emit('chat', msg);
        });
        
    });
server.listen(2000, () => {
  console.log('Server listening on port 2000');
});


