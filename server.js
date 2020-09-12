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

// SOCKET HERE
io = socketIo(server)
io.on('connection', socket => {
    console.log('new conection established')

    socket.on('addNewPlayer', () => {
        console.log("Adding new player..")
    })

    socket.on('disconnect', () => { 
        console.log('an user disconnected')
    })

    socket.on('hellosocket', () => {
        console.log('Socket working!')
    })

})

server.listen(5000, () => {
    console.log("CONNECTED TO PORT 5000!")
})


app.use((req, res, next) => {
    req.io = io;
    return next()
})