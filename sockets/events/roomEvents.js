const globalEmit = require('../emit/globalEmit');
const individualEmit = require('../emit/individualEmit');

module.exports = {

    getAllRooms (socket, rooms) {
        socket.on('getAllRooms', () => {
            individualEmit.sendAllRooms(socket, rooms)
        })
    },

    joinRoom (socket, rooms) {
        socket.on('joinRoom', (roomId) => {
            console.log("TRYING TO JOIN ROOM: ", roomId);
        })
    },
}