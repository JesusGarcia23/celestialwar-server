const individualEmit = require('../emit/individualEmit');
const groupalEmit = require('../emit/groupalEmit');
const { roomFinder, movePlayer, grabSphere, playerRespawner, playerAttackSystem } = require('../../utils/roomUtils');

module.exports = {

    // gets room's game status
    getGameStatus (io, socket, rooms) {
        socket.on('requestGameStatus', (data) => {

            console.log("REQUESTING!")
            console.log(data)
  
            const { user, roomId } = data;

            let actualRoom = roomFinder(roomId, rooms);

            if (actualRoom) {
                
                for (let j = 0; j <= actualRoom.gameStatus.players.length - 1; j++) {

                    if (actualRoom.gameStatus.players[j].name === user.username) {
                        socket.join(`room/${actualRoom.id}`);
                        groupalEmit.updateGameStatus(io, actualRoom);
                        break;
                    }

                } 
            }

        })
    },

    // moves user
    playerMoved (io, socket, rooms) {
        socket.on('movePlayer', (data) => {
            const { player, roomId, direction, moveAmount } = data;
            let updatedActualRoom = null;

            let actualRoom = roomFinder(roomId, rooms);

            if (actualRoom) {

                // return room with player positions updated (player moved)
                updatedActualRoom = movePlayer(actualRoom, player, direction, moveAmount);

                groupalEmit.updateGameStatus(io, updatedActualRoom);
            }

        })
    },

    // user grabs sphere
    playerGrabbedSphere (io, socket, rooms ) {
        socket.on('playerGrabbedSphere', (data) => {

            const { player, sphere, roomId } = data;

            let updatedActualRoom = null;

            let actualRoom = roomFinder(roomId, rooms);

            if (!player.sphereGrabbed && actualRoom) {

                let sphereToGrabIndex = actualRoom.gameStatus.spheres.findIndex(sphereToFind => sphereToFind.id === sphere.id);

                let sphereToGrab = null;

                if (sphereToGrabIndex < 0) {
                    return;
                }

                sphereToGrab = actualRoom.gameStatus.spheres[sphereToGrabIndex];

                // return room with player and sphere updated properties
                updatedActualRoom = grabSphere(actualRoom, player, sphereToGrabIndex, sphereToGrab);  

                groupalEmit.updateGameStatus(io, updatedActualRoom);

            }

        })
    },

    // user inserts sphere
    playerInsertSphere (io, socket, rooms) {
        socket.on('playerInsertSphere', (data) => {
            console.log("INSERT SPHERE REQUEST")
            console.log(data);

            const { player, sphere, sphereSocket, roomId } = data;
        })
    },

    // user attacks
    playerAttack (io, socket, rooms) {
        socket.on('playerAttacked', (data) => {

            const {firstPlayer, secondPlayer, roomId, action } = data;

            let actualRoom = roomFinder(roomId, rooms);

            if (actualRoom) {

                // Returns room with players updated properties (alive)
                let updatedActualRoom = playerAttackSystem(actualRoom, firstPlayer, secondPlayer, action);  

                if (updatedActualRoom && updatedActualRoom.attackHappened) {
                    groupalEmit.updateGameStatus(io, updatedActualRoom.room);
                }

            }

        })

    },

    // Respawns player back to game
    respawnPlayer(io, socket, rooms) {
        socket.on('respawnPlayer', (data) => {
            console.log("REQUESTING RESPAWN ", data)

            const { player, roomId } = data;

            let actualRoom = roomFinder(roomId, rooms);

            if (actualRoom) {

                // return room with player respawn
                let updatedActualRoom = playerRespawner(player, actualRoom);  

                individualEmit.resetRespawnRequest(socket, true);

                groupalEmit.updateGameStatus(io, updatedActualRoom);
            }

        })
    }
} 