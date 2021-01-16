export const roomFinder = (roomId, rooms) => {

    if (rooms) {
        for (let i = 0; i <= rooms.length - 1; i++) {
            if (rooms[i].id === Number(roomId)) {
                return rooms[i]; 
            }
        }
    }
    return null;
}


export const movePlayer = (room, player, direction, moveAmount) => {

    for (let j = 0; j <= room.gameStatus.players.length - 1; j++) {

        if (room.gameStatus.players[j].name === player.name) {
            
            switch (direction) {
                case "LEFT": 
                    room.gameStatus.players[j].direction = direction;
                    room.gameStatus.players[j].x -= moveAmount;
                    break;
                case "RIGHT":
                    room.gameStatus.players[j].direction = direction;
                    room.gameStatus.players[j].x += moveAmount;
                    break;
                case "UP":
                    room.gameStatus.players[j].onFloor = false;
                    room.gameStatus.players[j].y -= moveAmount;
                    break;
                case "DOWN":
                    room.gameStatus.players[j].y += moveAmount;
                default:
                    break;
            }
            break;
        }
    }

    return room;
}

export const grabSphere = (room, player, sphereToGrabIndex, sphereToGrab) => {

    for (let j = 0; j <= room.gameStatus.players.length - 1; j++) {

        if (room.gameStatus.players[j].name === player.name && !room.gameStatus.players[j].sphereGrabbed 
            && sphereToGrab && sphereToGrab.grabbedBy === "") {
            room.gameStatus.spheres[sphereToGrabIndex].grabbedBy = player.name;
            room.gameStatus.players[j].sphereGrabbed = true;
            break;
        }
    }

    return room;
}

export const playerAttackSystem = (actualRoom, firstPlayer, secondPlayer, action) => {

    let attackHappened = false;

    let firstPlayerToUpdateIndex = actualRoom.gameStatus.players.findIndex(playerToFind => playerToFind.name === firstPlayer.name);

    let secondPlayerToUpdateIndex = actualRoom.gameStatus.players.findIndex(playerToFind => playerToFind.name === secondPlayer.name);

    if (firstPlayerToUpdateIndex >= 0 && secondPlayerToUpdateIndex >= 0) {
            
        switch (action) {
            case "ATTACK":

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
    }

    return {attackHappened: attackHappened, room: actualRoom};
}

export const sphereInserter = (room, sphereSocket, sphere, player) => {

    for (let i = 0; i <= room.gameStatus.players.length - 1; i++) {
        if (player.name === room.gameStatus.players[i].name) {
            room.gameStatus.players[i].sphereGrabbed = false;
            break;
        }
    }

    for (let i = 0; i <= room.gameStatus.spheres.length - 1; i++) {
        if (sphere.id === room.gameStatus.spheres[i].id) {
            room.gameStatus.spheres[i].grabbedBy = '';
            room.gameStatus.spheres[i].hide = true;
            break;
        }
    }

    for (let i = 0; i <= room.gameStatus.map.length - 1; i++) {
        if (sphereSocket.id === room.gameStatus.map[i].id) {
            room.gameStatus.map[i].empty = false;
            room.gameStatus.map[i].color = "blue";
            break;
        }
    }

    if (player.side === "Angel") {
        room.gameStatus.angelPoints += 1;
    } else {
        room.gameStatus.demonPoints += 1;
    }

    //  check if any team won already
    if (room.gameStatus.angelPoints === 13) {
        room.gameStatus.winner = "Angel";
        room.gameStatus.gameFinished = true;
    } else if (room.gameStatus.demonPoints === 13) {
        room.gameStatus.winner = "Demon";
        room.gameStatus.gameFinished = true;
    }

    return room;
}

export const playerRespawner = (room, player) => {

    for (let j = 0; j <= room.gameStatus.players.length - 1; j++) {
        if ((room.gameStatus.players[j].name === player.name) && !room.gameStatus.players[j].alive) {
            room.gameStatus.players[j].x = room.gameStatus.players[j].deployX;
            room.gameStatus.players[j].y = room.gameStatus.players[j].deployY;
            room.gameStatus.players[j].alive = true;
            break;
        }
    }

    return room;
}