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
                console.log(rooms)
                // socket.emit(`room/${data.roomId}`, "Hello World");
            }
            else {
                console.log("ROOM NOT FOUND");
            }
        })
    },

    leavingRoom (io, socket, rooms) {
        socket.on('leaveRoom', (data) => {

            console.log("LEAVING ROOM", data)

            const { player, roomId } = data

            // Find the room where player is located
            let roomWherePlayerIsLocatedIndex = rooms.findIndex(room => room.id === Number(roomId));

            if (roomWherePlayerIsLocatedIndex >= 0) {
                
                let roomToUpdate = rooms[roomWherePlayerIsLocatedIndex];

                // Find the player position in "players" array inside the room object
                let playerToRemoveIndex = roomToUpdate.players.findIndex(playerInRoom => playerInRoom.username === player.username);

                let playerToRemoveIndexAngelTeam = roomToUpdate.angelTeam.findIndex(playerInRoom => playerInRoom.username === player.username);

                let playerToRemoveIndexDemonTeam = roomToUpdate.demonTeam.findIndex(playerInRoom => playerInRoom.username === player.username);

                if(playerToRemoveIndexAngelTeam >= 0) {
                    roomToUpdate.angelTeam.splice(playerToRemoveIndexAngelTeam,1);
                }

                if (playerToRemoveIndexDemonTeam >= 0) {
                    roomToUpdate.demonTeam.splice(playerToRemoveIndexDemonTeam,1);
                }

                roomToUpdate.players.splice(playerToRemoveIndex, 1);
                socket.leaves(`room/${roomId}`);
                individualEmit.userLeaveRoom(socket);
                groupalEmit.updateRoomData(io, roomToUpdate);

            }
        })
    },

    sendMessage (io, socket, rooms) {
        socket.on('sendMessage', (data) => {
            console.log(data);
            const {player, message, roomId } = data

            let actualRoomIndex = rooms.findIndex(room => room.id === roomId);

            if(actualRoomIndex >= 0) {
                let actualRoom = rooms[actualRoomIndex];
                let newMessage = {
                    sender: player.username,
                    message: message,
                    time: new Date()
                }
                actualRoom.messages.push(newMessage);
                groupalEmit.updateRoomData(io, actualRoom);
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
    },

    kickUser (io, socket, players, rooms) {

        socket.on('kickUser', (data) => {

            console.log(players);

            const { player, roomId } = data;

            let roomToUpdateIndex = rooms.findIndex(roomToFind => roomToFind.id === roomId);

            let roomToUpdate = rooms[roomToUpdateIndex];

            let playerIndex = roomToUpdate.players.findIndex(playerToKick => playerToKick.username === player.username)

            roomToUpdate.players.splice(playerIndex, 1);

            let playerAngelTeamIndex = roomToUpdate.angelTeam.findIndex(playerToFind => playerToFind.username === player.username);
            let playerDemonTeamIndex = roomToUpdate.demonTeam.findIndex(playerToFind => playerToFind.username === player.username);

            if (playerAngelTeamIndex >= 0) {
                roomToUpdate.angelTeam.splice(playerAngelTeamIndex, 1);
            } else if (playerDemonTeamIndex >= 0) {
                roomToUpdate.demonTeam.splice(playerDemonTeamIndex, 1);
            }

            let socketToKick = players[player.username];
            console.log(socketToKick);

            groupalEmit.updateRoomData(io, roomToUpdate);
            globalEmit.userKicked(io, socketToKick.id, roomId);

        })
    }
}