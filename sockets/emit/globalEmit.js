module.exports = {
    newRoomCreated(io, data) {
        io.sockets.emit('newRoomCreated', {rooms: data.rooms, accepted: data.accepted});
    },

    userKicked(io, userSocketId, roomId) {
        io.sockets.connected[userSocketId].emit('kicked', roomId);
    }
}