module.exports = {
    sendError(socket, data) {
        console.log(data)
        socket.emit('sendError', data)
    },
}