const globalEmit = require('../emit/globalEmit');
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
            const roomToJoinIndex = rooms.findIndex(room => room.id === data.roomId);

            if (roomToJoinIndex >= 0) {
                let actualRoom = rooms[roomToJoinIndex];
                actualRoom.players.push(data.player);
                console.log("TRYING TO JOIN ROOM: ", data);
                console.log(rooms[roomToJoinIndex]);
                individualEmit.goToRoom(socket, {roomId: data.roomId, accepted: true});
            }
        })
    },

    getRoomData (socket, rooms) {

    }
}