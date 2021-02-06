const express = require('express');
const http = require('http');
const socketIo = require("socket.io");
const userEvents = require('./sockets/events/userEvents');
const roomEvents = require('./sockets/events/roomEvents');
const gameEvents = require('./sockets/events/gameEvents');

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
        host: "",
        players: [],
        angelTeam: [],
        demonTeam: [],
        gameStarted: false,
        settings: {
            "map": "forest"
        },
        messages: [{sender: "Admin", message: "Hello World", time: new Date()},
        {sender: "jesus", message: "hello Jesus", time: new Date()},
        {sender: "Admin", message: "Hello World", time: new Date()},
        {sender: "Admin", message: "Hello World", time: new Date()},
        {sender: "Admin", message: "Hello World", time: new Date()},
        {sender: "Admin", message: "Hello World", time: new Date()},
        {sender: "Admin", message: "Hello World", time: new Date()},
        {sender: "Admin", message: "Hello World", time: new Date()},
        {sender: "Admin", message: "Hello World", time: new Date()},
        ]
    }
];


// SOCKET HERE
io = socketIo(server)
io.on('connection', socket => {

    // User Sockets
    userEvents.getUser(socket, players);
    userEvents.addNewPlayer(socket, players);
    userEvents.createNewRoom(io, socket, rooms);
    userEvents.disconnection(io, socket, players, rooms);

    // Rooms Sockets
    roomEvents.getAllRooms(socket, rooms);

    // socket when user joins room
    roomEvents.joinRoom(io, socket, rooms);

    // socket when user leaves room
    roomEvents.leavingRoom(io, socket, rooms);

    // socket when user sends message to chat
    roomEvents.sendMessage(io, socket, rooms);
    
    // socket when user swaps team
    roomEvents.swapTeam(io, socket, rooms);

    // socket to set user "ready" satus 
    roomEvents.setUserReady(io, socket, rooms);

    // socket to request new King position
    roomEvents.kingPositionRequested(io, socket, rooms);

    // socket to update new King position
    roomEvents.kingPositionAccepted(io, socket, rooms);

    // socket to kick user from room
    roomEvents.kickUser(io, socket, players, rooms);

    // socket to start game
    roomEvents.startGame(io, socket, rooms);

    // Game Sockets
    gameEvents.getGameStatus(io, socket, rooms);

     // socket when player moves
    gameEvents.playerMoved(io, socket, rooms);

    // socket when player grabs a sphere
    gameEvents.playerGrabbedSphere(io, socket, rooms);

    // socket when player dies and wants to respawn
    gameEvents.playerInsertSphere(io, socket, rooms);

    // socket when player attacks other players
    gameEvents.playerAttack(io, socket, rooms);

    // socket when player wants to transform to warrior
    gameEvents.transformToWarrior(io, socket, rooms);

    // socket when player dies and wants to respawn
    gameEvents.respawnPlayer(io, socket, rooms);
 
    console.log('new conection established ', socket.id)
    console.log("LIST OF ALL PLAYERS")
    console.log(players)

})

server.listen(5000, () => {
    console.log("CONNECTED TO PORT 5000!")
})


app.use((req, res, next) => {
    req.io = io;
    return next()
})