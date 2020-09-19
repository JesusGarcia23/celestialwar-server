const globalEmit = require('../emit/globalEmit');
const individualEmit = require('../emit/individualEmit');
const errorEmit = require('../emit/errorEmit');
module.exports = {

    addNewPlayer (socket, players) {
        socket.on('addNewPlayer', (username) => {
            let accepted = true;
            let playerAlreadyExist = players[username];
            if (playerAlreadyExist === undefined) {
                console.log("Adding new player..")
                console.log(username);
                players[username] = {
                    id: socket.id,
                    username: username
                }
                console.log(players);
                individualEmit.newPlayerAccepted(socket, {username: username, accepted: accepted});
            } else {
                errorEmit.sendError(socket, {type: 'user', message: 'User already exists'});
                accepted = false;
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
                individualEmit.goToCreatedRoom(socket, {newRoomCreated, accepted: true});
                globalEmit.newRoomCreated(io, {rooms, accepted: true});
            }
        })
    }
}