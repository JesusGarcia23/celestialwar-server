const globalEmit = require('../emit/globalEmit');
const individualEmit = require('../emit/individualEmit');
const errorEmit = require('../emit/errorEmit');
const validators = require('../../utils/validators');

module.exports = {

    getUser (socket, players) {
        socket.on('getUser', (username) => {
            let accepted = true;
            let playerExists = validators.checkPlayerExistence(username, players);
            if (!playerExists) {
                players[username] = {
                    id: socket.id,
                    username: username
                }
                individualEmit.loggedIn(socket, {username: username, accepted: accepted});
            } else {
                individualEmit.loggedIn(socket, {username: username, accepted: false});
                errorEmit.sendError(socket, {type: 'username', message: 'Username already in use'});
            }
        })
    },

    addNewPlayer (socket, players) {
        socket.on('addNewPlayer', (username) => {
            console.log(username)
            let accepted = false;
            let playerExists = validators.checkPlayerExistence(username, players);
            if (!playerExists) {
                players[username] = {
                    id: socket.id,
                    username: username
                }
                accepted = true;
                individualEmit.newPlayerAccepted(socket, {username: username, accepted: accepted});
            } else {
                individualEmit.newPlayerAccepted(socket, {username: username, accepted: accepted});
                errorEmit.sendError(socket, {type: 'username', message: 'Username already in use'});
            }
        })
    },

    createNewRoom (io, socket, rooms) {
        socket.on('createNewRoom', (newRoom) => {
            let newRoomCreated =     
            {
                id: rooms.length + 1,
                name: newRoom.roomName,
                players: [],
            }
    
            let roomExists = rooms.findIndex(room => room.name === newRoom.roomName);
            console.log(roomExists)
            if(roomExists >= 0) {
                errorEmit.sendError(socket, {type: 'room', message: 'Room already exists'});
            } else {
                rooms.push(newRoomCreated);
                individualEmit.goToRoom(socket, {roomId: newRoomCreated.id, accepted: true});
                globalEmit.newRoomCreated(io, {rooms, accepted: true});
            }
        })
    }
}