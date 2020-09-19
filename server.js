const express = require('express');
const http = require('http');
const socketIo = require("socket.io");

let app = express(), io;
const server = http.createServer(app)
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const routes = require('./routes/routes');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname , 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000"]
}))

app.use(routes)

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  });

let players = {};
let rooms = [
    {
        id: 1,
        name: "Hello World",
        players: [],
    }
];

let listGameStatus = {}

// SOCKET HERE
io = socketIo(server)
io.on('connection', socket => {
 
    console.log('new conection established ', socket.id)
    console.log("LIST OF ALL PLAYERS")
    console.log(players)

    // request to add new player
    socket.on('addNewPlayer', (username) => {
        let accepted = true;
        console.log("Adding new player..")
        console.log(username);
        let playerAlreadyExist = players[username];
        if (playerAlreadyExist === undefined) {
            players[username] = {
                id: socket.id,
                username: username
            }
        } else {
            accepted = false;
        }
        console.log(players);
        socket.emit('newPlayerAccepted', {username: username, accepted: accepted})
    })

    socket.on('getUser', (username) => {
        let accepted = true;
        console.log(username)
        let playerAlreadyExist = players[username];
        if (playerAlreadyExist === undefined && username !== null) {
            players[username] = {
                id: socket.id,
                username: username
            }
        } else {
            accepted = false;
        }
        socket.emit('loggedIn', {username: username, accepted: accepted})
    })

    // request from client to get all Rooms
    socket.on('getAllRooms', () => {
        socket.emit('sendAllRooms', rooms);
    })
    
    // request from client to create new room
    socket.on('createNewRoom', (newRoom) => {
        let newRoomCreated =     
        {
            id: rooms.length + 1,
            name: newRoom.roomName,
            players: [],
        }

        let roomExists = rooms.findIndex(room => room.name === newRoom.roomName);

        if(roomExists >= 0) {
            socket.emit('newRoomCreated', {rooms, accepted: false});
        } else {
            rooms.push(newRoomCreated);
            socket.emit('goToCreatedRoom', {newRoomCreated, accepted: true});
            io.sockets.emit('newRoomCreated', {rooms, accepted: true});
        }
    })

    // request from client to join room
    socket.on('joinRoom', (roomId) => {
        console.log("TRYING TO JOIN ROOM: ", roomId);
    })

    socket.on('disconnect', () => { 
        for (let player of Object.values(players)) {
            console.log(player)
            if(socket.id === player.id) {
                console.log('an user disconnected: ', player.username);
                delete players[player.username];
            }
        }
    })

})

server.listen(5000, () => {
    console.log("CONNECTED TO PORT 5000!")
})


app.use((req, res, next) => {
    req.io = io;
    return next()
})