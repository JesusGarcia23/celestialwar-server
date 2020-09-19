module.exports = {
    newPlayerAccepted(socket, data) {
        socket.emit('newPlayerAccepted', {username: data.username, accepted: data.accepted})
    },

    sendAllRooms(socket, rooms) {
        socket.emit('sendAllRooms', rooms);
    },

    goToCreatedRoom(socket, data) {
        socket.emit('goToCreatedRoom', {newRoomCreated: data.newRoomCreated, accepted: data.accepted});
    },
}