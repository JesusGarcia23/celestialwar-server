module.exports = {

    // Check for user logged
    loggedIn(socket, data) {
        socket.emit('loggedIn', {username: data.username, accepted: data.accepted})
    },

    // signs up/creates an user
    newPlayerAccepted(socket, data) {
        socket.emit('newPlayerAccepted', {username: data.username, accepted: data.accepted})
    },
    // sends all rooms to user
    sendAllRooms(socket, rooms) {
        socket.emit('sendAllRooms', rooms);
    },

    getInitialRoomData(socket, data) {
        socket.emit('getInitialRoomData', data);
    },
    
    // redirects user to the room
    sendUserToRoom(socket, roomId) {
        socket.emit('goToRoom', roomId);
    },

    // removes user from the room
    userLeaveRoom(socket, roomId) {
        socket.leave(`room/${roomId}`);
        socket.emit('exitedRoom', true);
    },

    // Game Emit
    resetRespawnRequest(socket) {
        console.log("RESPAWN RECOVER")
        socket.emit('resetRespawnRequest', false);
    }

}