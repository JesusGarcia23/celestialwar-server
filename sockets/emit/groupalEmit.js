module.exports = {

    updateIndividualRoomData (socket, roomId, data) {
        socket.broadcast.to(`room/${roomId}`).emit('getUpdatedRoom', data);
    }

}