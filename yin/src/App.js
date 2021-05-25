import './App.css';
import Socket from 'socket.io-client';
import background from "./img/bg.jpg";
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

  const Menu = () => {
    const [username, setUsername] = useState(null);

    return (
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold text-white mt-20">Chinese checkers</h1>
        <p className="text-white mt-20">username: {username}</p>
        <input name="username" value={username} className="p-2 w-1/2 rounded-lg mt-3" onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <button className="bg-blue-600 text-white text-xl font-bold px-16 py-3 mt-5 rounded-lg" onClick={create_room}>play</button>
        <button className="bg-blue-400 text-white text-lg font-bold px-16 py-3 rounded-lg" onClick={create_room}>Create a room</button>
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
    <div className="App bg-blue-400 w-full h-full" style={{
      backgroundImage: `url(${background})`
    }}>
      {ingame === true ? <Game roomid={room} /> : <Menu setingame={setingame} />}
    </div>
  );
}
