var express = require('express')
const fetch = require('node-fetch');
var app = express()
const http = require('http');
const server = http.createServer(app);

var furl = "http: //localhost:3000"
    // var furl = http://localhost:3000/

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

app.get('/', (req, res) => {
    res.send('<h1>' + 'server_page' + '</h1>');
});

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    });
});

io.on('connection', (socket) => {
    socket.on('create_room', (msg) => {
        fetch('https://random-word-api.herokuapp.com/word?number=10')
            .then(res => res.json())
            .then(body => {
                socket.emit('new_room', { url: `${furl}?room=${body.toString().replace(',','')}`, name: body.toString().replace(',', '') });
            });
    });
});

io.on('connection', (socket) => {
    socket.on('move_me_to_room', (msg) => {
        socket.join(msg.room_name);
    });
});

io.on('connection', (socket) => {
    socket.on('existing_rooms', (msg) => {
        socket.emit('open_rooms', { rooms: io.sockets.manager.rooms });
    });
});

io.on('connection', (socket) => {
    socket.on('move', (msg) => {
        console.log(msg.from);
        console.log(msg.to);
    });
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});