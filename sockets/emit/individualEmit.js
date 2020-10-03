module.exports = {

    loggedIn(socket, data) {
        socket.emit('loggedIn', {username: data.username, accepted: data.accepted})
    },

    newPlayerAccepted(socket, data) {
        socket.emit('newPlayerAccepted', {username: data.username, accepted: data.accepted})
    },

    sendAllRooms(socket, rooms) {
        socket.emit('sendAllRooms', rooms);
    },

    getInitialRoomData(socket, data) {
        socket.emit('getInitialRoomData', data);
    },

    sendUserToRoom(socket, roomId) {
        socket.emit('goToRoom', roomId);
    },
    
}