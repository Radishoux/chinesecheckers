import './App.css';
import Socket from 'socket.io-client';
import background from "./img/bg.jpg";
import React, { useState, useEffect } from 'react';

var socket = Socket('http://localhost:3001');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// socket.emit('chat message', "je suis co");


export default function App() {
    const [init] = useState(true);
    const [ingame, setingame] = useState(false);
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState(urlParams.get('room'));

    useEffect(() => {
        socket.on("new_room", rroom => {
            setRoom(rroom.name);
            console.log(rroom.url);
            console.log(rroom.name);
            on_type_un_input();
        })

        socket.on("open_rooms", rooms => {
            console.log(rooms.rooms);
        })

        socket.on("joined_room", rroom => {
            alert("welcome to room " + rroom.roomname);
            setingame(true);
        })

    }, [init])// eslint-disable-line react-hooks/exhaustive-deps

    function create_room(params) {
        socket.emit('create_room', "");
    }

    function move_me_to_room(params) {
        if (room === null || room === undefined || room === "") {
            alert("get a room!");
        }
        else if (document.getElementById("username_input").value === "") {
            alert("You'll need a username first");
        }
        else {
            setUsername(document.getElementById("username_input").value);
            console.log(room);
            socket.emit('move_me_to_room', {room_name: room});
        }
    }

    function on_type_un_input() {
        if (document.getElementById("username_input").value === "" || room === null || room === "") {
            document.getElementById("playbtn").style.background = "grey";
        }
        else {
            document.getElementById("playbtn").style.background = "green";
        }
    }

    function Extra() {
        return (
            <div style={{"background":"rgba(255,255,255,0.7)", "height":"150px", "width":"50vw", "margin":"10px", "borderRadius":"10px"}}>
            {room === null || room === undefined || room === "" ?
            <h2 className="text-4xl font-bold mt-20">Regles</h2>
            :
            <h2 className="text-4xl font-bold mt-20">Room_infos</h2>
            }
            </div>
        )
    }

    function Menu() {
        return (
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-5xl font-bold text-white mt-20">Chinese checkers</h1>
                <h2 className="text-4xl font-bold text-white mt-20">username</h2>
                <input id="username_input" name="username" className="p-2 w-2/5 rounded-lg mt-3" onChange={on_type_un_input} placeholder="Username" />
                <button id="playbtn" className="text-white text-xl font-bold px-16 py-3 mt-5 rounded-lg" onClick={move_me_to_room} style={{"background":"grey"}}>play</button>
                <button className="bg-blue-400 text-white text-lg font-bold px-16 py-3 rounded-lg" onClick={create_room}>Create a room</button>

                <Extra/>
            </div>
        )
    }

    function Game() {
        return (
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-5xl font-bold text-white mt-20">{room}</h1>
            </div>
        )
    }

    return (
        <div className="App bg-blue-400 w-full h-full" style={{
            backgroundImage: `url(${background})`
        }}>
            {ingame === true ? <Game un={username} roomid={room} /> : <Menu setingame={setingame} />}
        </div>
    );
}
