const express = require('express');
const http = require('http');
const socketIo = require("socket.io");
const userEvents = require('./sockets/events/userEvents');
const roomEvents = require('./sockets/events/roomEvents');

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

let listGameStatus = [
    {
        id: 0,
        players: [
            {
                name: "",
                side: "",
                x: 0,
                y: 0,
                alive: true,
                modeWarrior: false,
                sphereGrabbed: false,
                king: false,
            }
        ],
        demonTeam: {
            kills: 0,
            containersFilled: 0,
        },
        angelTeam: {
            kills: 0,
            containersFilled: 0,
        },
        map: "",
    }
]

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
    roomEvents.joinRoom(io, socket, rooms);
    roomEvents.leavingRoom(io, socket, rooms);
    roomEvents.sendMessage(io, socket, rooms);
    roomEvents.swapTeam(io, socket, rooms);
    roomEvents.setUserReady(io, socket, rooms);
    roomEvents.kingPositionRequested(io, socket, rooms);
    roomEvents.kingPositionAccepted(io, socket, rooms);
    roomEvents.kickUser(io, socket, players, rooms);
    roomEvents.startGame(io, socket, rooms);
 
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