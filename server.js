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
        players: [],
        angelTeam: [],
        demonTeam: [],
        settings: {
            "map": "forest"
        },
        map: "forest",

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

    // Rooms Sockets
    roomEvents.getAllRooms(socket, rooms);
    roomEvents.getRoomData(socket, rooms);
    roomEvents.joinRoom(socket, rooms)
 
    console.log('new conection established ', socket.id)
    console.log("LIST OF ALL PLAYERS")
    console.log(players)
    
    socket.on('disconnect', () => { 
        for (let player of Object.values(players)) {

            // Match socket with player
            if(socket.id === player.id) {  
                
                // Find the room where player is located
                let roomWherePlayerIsLocatedIndex = rooms.findIndex(room => room.players.findIndex(player => player.username === player.username) >= 0)

                if (roomWherePlayerIsLocatedIndex >= 0) {
                    
                    let roomToUpdate = rooms[roomWherePlayerIsLocatedIndex];

                    // Find the player position in "players" array inside the room object
                    let playerToRemoveIndex = roomToUpdate.players.findIndex(playerInRoom => playerInRoom.username === player.username);
                    roomToUpdate.players.splice(playerToRemoveIndex,1);
                    
                }
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