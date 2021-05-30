var express = require('express')
const fetch = require('node-fetch');
var app = express()
const http = require('http');
const server = http.createServer(app);

var furl = "http://localhost:3000"

let users = []

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
        console.log('create_room', socket.id)
        fetch('https://random-word-api.herokuapp.com/word?number=3')
            .then(res => res.json())
            .then(body => {
                console.log(body.toString().replace(/,/g,''))
                socket.emit('new_room', { url: `${furl}?room=${body.toString().replace(/,/g,'')}`, name: body.toString().replace(/,/g, '') });
            });
    });
});

io.on('connection', (socket) => {
    socket.on('move_me_to_room', (msg) => {
        console.log('move_me_to_room', socket.id, msg)
        socket.join(msg.room_name);
        users.push(msg)
        socket.emit('joined_room', users);
    });
});

io.on('connection', (socket) => {
    socket.on('existing_rooms', (msg) => {
        console.log('existing_rooms', socket.id)
        socket.emit('open_rooms', { rooms: io.sockets.manager.rooms, users });
    });
});

io.on('connection', (socket) => {
    socket.on('move', (msg) => {
        console.log('move', socket.id)
        console.log(msg.from);
        console.log(msg.to);
    });
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});