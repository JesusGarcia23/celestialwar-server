module.exports = {

    updateRoomData (io, data) {
        io.in(`room/${data.id}`).emit('getUpdatedRoom', data);
    },

    // Emits for game
    sendGameStatus (io, data) {
        io.in(`room/${data.id}`).emit('getGameStatus', data);
    },

    updateGameStatus (io, data) {
        io.in(`room/${data.id}`).emit('updateGameStatus', data);
    }
}