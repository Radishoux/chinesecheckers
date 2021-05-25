import './App.css';
import Socket from 'socket.io-client';
import React, { useState, useEffect } from 'react';

var socket = Socket('http://localhost:3001');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var room = urlParams.get('room');

// socket.emit('chat message', "je suis co");


export default function App() {
    const [init, setinit] = useState(true);
    const [ingame, setingame] = useState(false);

    useEffect(() => {
        socket.on("new_room", room => {
            console.log(room.url);
            console.log(room.name);
        })

        socket.on("open_rooms", rooms => {
            console.log(rooms.rooms);
        })
    }, [init])


    function create_room(params) {
        socket.emit('create_room', "");
    }

    function Menu() {
        return (
            <div className="Menu">
                <h1>presentations</h1>
                <button onClick={create_room}>Create Room</button>
            </div>
        )
    }

    function Game() {
        return (
            <div>

            </div>
        )
    }

    return (
        <div className="App">
            {ingame === true ? <Game roomid={room} /> : <Menu setingame={setingame} />}
        </div>
    );
}