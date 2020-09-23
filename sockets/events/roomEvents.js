const globalEmit = require('../emit/globalEmit');
const groupalEmit = require('../emit/groupalEmit');
const individualEmit = require('../emit/individualEmit');

module.exports = {

    getAllRooms (socket, rooms) {
        socket.on('getAllRooms', () => {
            individualEmit.sendAllRooms(socket, rooms)
        })
    },

    joinRoom (socket, rooms) {
        socket.on('joinRoom', (data) => {
            console.log(rooms)
            const roomToJoinIndex = rooms.findIndex(room => room.id === Number(data.roomId));
            console.log("TRYING TO JOIN ROOM: ", data.roomId);
            if (roomToJoinIndex >= 0) {
                let actualRoom = rooms[roomToJoinIndex];
                console.log("JOINING TO ROOM: ", data);
                let isUserAlreadyInRoom = actualRoom.players.findIndex(player => player.username === data.player.username);

                if (isUserAlreadyInRoom < 0) {
                    actualRoom.players.push(data.player);
                }
                socket.join(`room/${data.roomId}`);
                individualEmit.goToRoom(socket, {player: data.player, roomId: data.roomId, accepted: true});
                groupalEmit.updateIndividualRoomData(socket, data.roomId, "Hello World");
                // socket.emit(`room/${data.roomId}`, "Hello World");
            }
            else {
                console.log("ROOM NOT FOUND");
            }
        })
    },

    getRoomData (socket, rooms) {
        socket.on('getRoomData', (data) => {
            console.log("LIST OF FROM SERVER: ")
            console.log(rooms)
            console.log(data)
            const { roomId } = data;            
        })
    }
}