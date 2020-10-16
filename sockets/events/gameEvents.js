module.exports = {

    getGameStatus (io, socket, rooms) {
        socket.on('requestGameStatus', (data) => {
  
            const { player, roomId } = data;

            let actualRoomIndex = rooms.findIndex(room => room.id === Number(roomId));

            let actualRoom = rooms[actualRoomIndex];

            if (actualRoom && actualRoom.players.findIndex(player => player.username === player.username) >= 0) {
                console.log("GAME FOUND");
                const { settings, angelTeam, demonTeam, gameStatus } = actualRoom;
                console.log(settings)


            }
        })
    },
} 