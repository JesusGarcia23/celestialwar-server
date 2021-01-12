const individualEmit = require('../emit/individualEmit');
const groupalEmit = require('../emit/groupalEmit');

module.exports = {

    // gets room's game status
    getGameStatus (io, socket, rooms) {
        socket.on('requestGameStatus', (data) => {

            console.log("REQUESTING!")
            console.log(data)
  
            const { user, roomId } = data;

            for (let i = 0; i <= rooms.length - 1; i++) {
                if (rooms[i].id === Number(roomId)) {

                    let actualRoom = rooms[i];

                    for (let j = 0; j <= actualRoom.gameStatus.players.length - 1; j++) {

                        if (actualRoom.gameStatus.players[j].name === user.username) {
                            socket.join(`room/${actualRoom.id}`);
                            groupalEmit.updateGameStatus(io, actualRoom);
                            break;
                        }

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

            for (let i = 0; i <= rooms.length - 1; i++) {
                if (rooms[i].id === Number(roomId)) {

                    let actualRoom = rooms[i];

                    for (let j = 0; j <= actualRoom.gameStatus.players.length - 1; j++) {

                        if (actualRoom.gameStatus.players[j].name === player.name) {
                            
                            switch (direction) {
                                case "LEFT": 
                                    actualRoom.gameStatus.players[j].direction = direction;
                                    actualRoom.gameStatus.players[j].x -= moveAmount;
                                    break;
                                case "RIGHT":
                                    actualRoom.gameStatus.players[j].direction = direction;
                                    actualRoom.gameStatus.players[j].x += moveAmount;
                                    break;
                                case "UP":
                                    actualRoom.gameStatus.players[j].onFloor = false;
                                    actualRoom.gameStatus.players[j].y -= moveAmount;
                                    break;
                                case "DOWN":
                                    actualRoom.gameStatus.players[j].y += moveAmount;
                                default:
                                    break;
                            }
                            break;
                        }

                    }
    
                    updatedActualRoom = actualRoom;  
    
                    //groupalEmit.updateRoomData(io, updatedActualRoom);
                    groupalEmit.updateGameStatus(io, updatedActualRoom);
                    break;
                }
            }

        })
    },

    // user grabs sphere
    playerGrabbedSphere (io, socket, rooms ) {
        socket.on('playerGrabbedSphere', (data) => {

            const { player, sphere, roomId } = data;
            let updatedActualRoom = null;

            if (!player.sphereGrabbed) {
                
                for (let i = 0; i <= rooms.length - 1; i++) {
                    if (rooms[i].id === Number(roomId)) {

                        let actualRoom = rooms[i]; 

                        let sphereToGrabIndex = actualRoom.gameStatus.spheres.findIndex(sphereToFind => sphereToFind.id === sphere.id);

                        let sphereToGrab = null;

                        if (sphereToGrabIndex >= 0) {
                            sphereToGrab = actualRoom.gameStatus.spheres[sphereToGrabIndex];
                        }

                        for (let j = 0; j <= actualRoom.gameStatus.players.length - 1; j++) {

                            if (actualRoom.gameStatus.players[j].name === player.name && !actualRoom.gameStatus.players[j].sphereGrabbed 
                                && sphereToGrab && sphereToGrab.grabbedBy === "") {
                                actualRoom.gameStatus.spheres[sphereToGrabIndex].grabbedBy = player.name;
                                actualRoom.gameStatus.players[j].sphereGrabbed = true;
                                break;
                            }

                        }
        
                        updatedActualRoom = actualRoom;  

                        groupalEmit.updateGameStatus(io, updatedActualRoom);
                        break;
                    }
                }
            }

        })
    },

    // user inserts sphere
    playerInsertSphere (io, socket, rooms) {
        socket.on('playerInsertSphere', (data) => {
            console.log("INSERT SPHERE REQUEST")
            console.log(data);

            const { player, sphere, sphereSocket,roomId } = data;
        })
    },

    // user attacks
    playerAttack (io, socket, rooms) {
        socket.on('playerAttacked', (data) => {

            const {firstPlayer, secondPlayer, roomId, action, points } = data;

            let attackHappened = false;

            for (let i = 0; i <= rooms.length - 1; i++) {
                if (rooms[i].id === Number(roomId)) {

                    let actualRoom = rooms[i]; 

                    let firstPlayerToUpdateIndex = actualRoom.gameStatus.players.findIndex(playerToFind => playerToFind.name === firstPlayer.name);

                    let secondPlayerToUpdateIndex = actualRoom.gameStatus.players.findIndex(playerToFind => playerToFind.name === secondPlayer.name);
    
                    if (firstPlayerToUpdateIndex >= 0 && secondPlayerToUpdateIndex >= 0) {
                        
                        switch (action) {
                            case "ATTACK":
                                // update second player properties
                                // actualRoom.gameStatus.players[firstPlayerToUpdateIndex]

                                console.log(actualRoom.gameStatus.players[secondPlayerToUpdateIndex])

                                // update second player properties
                                actualRoom.gameStatus.players[secondPlayerToUpdateIndex].alive = false;
                                attackHappened = true;

                                if (actualRoom.gameStatus.players[secondPlayerToUpdateIndex].king) {
                                    console.log("KING KILLED!")
                                }

                                break;
                            
                            default:
                                break;
                        }

                        if (attackHappened) {
                            let updatedActualRoom = actualRoom;  
                            groupalEmit.updateGameStatus(io, updatedActualRoom);
                        }
                    }
                    break;
                }
            }
        })

    },

    // Respawns player back to game
    respawnPlayer(io, socket, rooms) {
        socket.on('respawnPlayer', (data) => {
            console.log("REQUESTING RESPAWN ", data)

            const { myPlayer, roomId } = data;

            for (let i = 0; i <= rooms.length - 1; i++) {
                if (rooms[i].id === Number(roomId)) {

                    let actualRoom = rooms[i];

                    for (let j = 0; j <= actualRoom.gameStatus.players.length - 1; j++) {
                        if ((actualRoom.gameStatus.players[j].name === myPlayer.name) && !actualRoom.gameStatus.players[j].alive) {
                            actualRoom.gameStatus.players[j].x = actualRoom.gameStatus.players[j].deployX;
                            actualRoom.gameStatus.players[j].y = actualRoom.gameStatus.players[j].deployY;
                            actualRoom.gameStatus.players[j].alive = true;
                            break;
                        }
                    }
    
                    let updatedActualRoom = actualRoom;  
                    individualEmit.resetRespawnRequest(socket, true);
                    groupalEmit.updateGameStatus(io, updatedActualRoom);
                    break;
                }
            }
        })
    }
} 