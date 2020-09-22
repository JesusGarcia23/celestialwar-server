module.exports = {
    updateRoomData (io, data) {
        io.sockets.emit('newRoomCreated', {rooms: data.rooms, accepted: data.accepted});
    },
}