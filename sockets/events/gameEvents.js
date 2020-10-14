module.exports = {

    getGameStatus (io, socket, rooms) {
        socket.on('requestGameStatus', (data) => {
            console.log(data);

            const { player, roomId } = data;

            let actualRoomIndex = rooms.findIndex(room => room.id === Number(roomId));

            let actualRoom = rooms[actualRoomIndex];

            if (actualRoom && actualRoom.players.findIndex(player => player.username === player.username) >= 0) {
                console.log("GAME FOUND");
                console.log(actualRoom)


            }
        })
    },
} 