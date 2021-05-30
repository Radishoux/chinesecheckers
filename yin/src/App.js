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
    const [roomUrl, setRoomUrl] = useState(urlParams.get('room'));


    useEffect(() => {
        socket.on("new_room", room => {
            setRoom(room.name);
            setRoomUrl(room.url)
            console.log(room.url);
            console.log(room.name);
            on_type_un_input();
        })

        socket.on("create_room", rooms => {
            console.log(rooms);
        })

        socket.on("open_rooms", rooms => {
            console.log(rooms.rooms);
        })

        socket.on("joined_room", rroom => {
            alert("welcome to room " + rroom.roomname);
            setingame(true);
        })

    }, [init])// eslint-disable-line react-hooks/exhaustive-deps


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
            <div className="p-10 bg-gray-200 rounded-lg mt-5 w-2/5">
            {room === null || room === undefined || room === "" ?
            <div className="text-xl">
                <p className='text-2xl font-bold'>Rules</p>
                <p className="mt-4">Chinese Checkers (or Chinese Chequers) was invented in the 1920s in America and has nothing to do with China. In fact it's based on an earlier Victorian game called Halma which is played on a square 16 x 16 chequer board.</p>
                <p className="mt-4">A toss of a coin decides who starts. Players take turns to move a single peg of their own colour. In one turn a peg may either be simply moved into an adjacent hole OR it may make one or more hops over other pegs.</p>
            </div>
            :
            <div className="text-xl">
                <p>Room Name: <span className="font-bold">{room}</span></p>
                <p className="mt-3">Room URL: <span className="font-bold">{roomUrl}</span></p>
                <button onClick={() => navigator.clipboard.writeText(roomUrl)} className="bg-blue-300 rounded-lg py-2 px-5">Copy room url</button>
            </div>
            }
            </div>
        )
    }

    function Menu() {

        const createRoom = () => {
            socket.emit('create_room', "");
        }

        return (
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-5xl font-bold text-white mt-20">Chinese checkers</h1>
                <h2 className="text-4xl font-bold text-white mt-20">username</h2>
                <input id="username_input" name="username" className="p-2 w-2/5 rounded-lg mt-3" onChange={on_type_un_input} placeholder="Username" />
                <button id="playbtn" className="text-white text-xl font-bold px-16 py-3 mt-5 rounded-lg" onClick={move_me_to_room} style={{"background":"grey"}}>play</button>
                <button onClick={createRoom} className="bg-blue-400 text-white text-lg font-bold px-16 py-3 rounded-lg" >Create a room</button>

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
