module.exports = {

    updateIndividualRoomData (socket, data) {
        console.log("THIS WAS SENT")
        console.log(data);
        socket.broadcast.to(`room/${data.id}`).emit('getUpdatedRoom', data);
    }

}