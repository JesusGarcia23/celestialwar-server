module.exports = {

    updateRoomData (io, data) {
        io.in(`room/${data.id}`).emit('getUpdatedRoom', data);
    }

}