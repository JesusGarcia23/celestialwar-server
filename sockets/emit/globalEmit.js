module.exports = {
    newRoomCreated(io, data) {
        io.sockets.emit('newRoomCreated', {rooms: data.rooms, accepted: data.accepted});
    },
}