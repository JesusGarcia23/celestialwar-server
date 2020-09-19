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
    }
];

let listGameStatus = {}

// SOCKET HERE
io = socketIo(server)
io.on('connection', socket => {

    // User Sockets
    userEvents.getUser(socket, players);
    userEvents.addNewPlayer(socket, players);
    userEvents.createNewRoom(io, socket, rooms);

    // Rooms Sockets
    roomEvents.getAllRooms(socket, rooms);
    roomEvents.joinRoom(socket, rooms)
 
    console.log('new conection established ', socket.id)
    console.log("LIST OF ALL PLAYERS")
    console.log(players)
    
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