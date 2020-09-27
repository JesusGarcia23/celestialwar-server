const globalEmit = require('../emit/globalEmit');
const groupalEmit = require('../emit/groupalEmit');
const individualEmit = require('../emit/individualEmit');

module.exports = {

    getAllRooms (socket, rooms) {
        socket.on('getAllRooms', () => {
            individualEmit.sendAllRooms(socket, rooms)
        })
    },

    joinRoom (io, socket, rooms) {
        socket.on('joinRoom', (data) => {
            console.log("CHECK THIS")
            console.log(data)
            const roomToJoinIndex = rooms.findIndex(room => room.id === Number(data.roomId));
            console.log("TRYING TO JOIN ROOM: ", data.roomId);
            if (roomToJoinIndex >= 0) {
                let actualRoom = rooms[roomToJoinIndex];
                console.log("JOINING TO ROOM: ", data);
                let isUserAlreadyInRoom = actualRoom.players.findIndex(player => player.username === data.player.username);

                //  Check for room max capacity
                if(actualRoom.players > 10) {
                    return;
                }

                //  Check if user is already in room (so is not pushed to array again)
                if (isUserAlreadyInRoom < 0) {
                    actualRoom.players.push(data.player);

                    let isPlayerAlreadyOnATeam = actualRoom.angelTeam.findIndex(player => player.username === data.player.username);
                    let isPlayerInDemonTeam = actualRoom.demonTeam.findIndex(player => player.username === data.player.username);

                    let playerWithoutTeam = (isPlayerAlreadyOnATeam < 0) && (isPlayerInDemonTeam < 0)

                    if(actualRoom.angelTeam.length < 5 && actualRoom.angelTeam.length <= actualRoom.demonTeam.length && playerWithoutTeam) {
                        actualRoom.angelTeam.push(data.player);
                    } else if(actualRoom.demonTeam.length < 5 && actualRoom.demonTeam.length <= actualRoom.angelTeam.length && playerWithoutTeam) {
                        actualRoom.demonTeam.push(data.player);
                    }


                }
                socket.join(`room/${actualRoom.id}`);
                groupalEmit.updateRoomData(io, actualRoom);
                individualEmit.goToRoom(socket, {player: data.player, roomInfo: actualRoom, accepted: true});
                console.log(rooms)
                // socket.emit(`room/${data.roomId}`, "Hello World");
            }
            else {
                console.log("ROOM NOT FOUND");
            }
        })
    },

    swapTeam (io, socket, rooms) {
        socket.on('swapTeam', (data) => {
            console.log("SWAPING TEAM...")
            const {player, roomId} = data;

            let actualRoomIndex = rooms.findIndex(room => room.id === roomId);

            if(actualRoomIndex >= 0) {
                let actualRoom = rooms[actualRoomIndex];

                let playerAngelTeamIndex = actualRoom.angelTeam.findIndex(playerToFind => playerToFind.username === player.username);
                let playerDemonTeamIndex = actualRoom.demonTeam.findIndex(playerToFind => playerToFind.username === player.username);

                if (playerAngelTeamIndex >= 0 && actualRoom.demonTeam.length < 5) {
                    actualRoom.angelTeam.splice(playerAngelTeamIndex, 1);
                    actualRoom.demonTeam.push({username: player.username, accepted: player.accepted});
                    groupalEmit.updateRoomData(io, actualRoom);

                } else if (playerDemonTeamIndex >= 0 && actualRoom.angelTeam.length < 5) {
                    actualRoom.demonTeam.splice(playerDemonTeamIndex, 1);
                    actualRoom.angelTeam.push({username: player.username, accepted: player.accepted});
                    groupalEmit.updateRoomData(io, actualRoom);
                }
            }
        })
    }
}