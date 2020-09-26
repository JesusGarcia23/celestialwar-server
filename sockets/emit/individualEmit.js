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

    goToRoom(socket, data) {
        console.log(data)
        socket.emit('goToRoom', {user: data.player, roomInfo: data.roomInfo, accepted: data.accepted});
    },
}