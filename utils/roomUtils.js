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

                // update second player properties
                actualRoom.gameStatus.players[secondPlayerToUpdateIndex].alive = false;
                attackHappened = true;

                // remove modeWarrior property from dead player
                if (!actualRoom.gameStatus.players[secondPlayerToUpdateIndex].king) {
                    actualRoom.gameStatus.players[secondPlayerToUpdateIndex].modeWarrior = false;
                }

                // Check if player killed is king (to add points to score)
                if (actualRoom.gameStatus.players[secondPlayerToUpdateIndex].king) {

                    // Check player team to add points to the kills (angelKills or demonKills)
                    if (actualRoom.gameStatus.players[firstPlayerToUpdateIndex].side === "Angel") {
                        actualRoom.gameStatus.angelKills += 1;
                    } else {
                        actualRoom.gameStatus.demonKills += 1;
                    }

                    checkForWinner(actualRoom, "kills");
                }
                break;
            
            default:
                break;
        }
    }

    return {attackHappened: attackHappened, room: actualRoom};
}

export const sphereInserter = (actualRoom, sphereSocket, sphere, player) => {

    // change player sphereGrabbed to false
    for (let i = 0; i <= actualRoom.gameStatus.players.length - 1; i++) {
        if (player.name === actualRoom.gameStatus.players[i].name) {
            actualRoom.gameStatus.players[i].sphereGrabbed = false;
            break;
        }
    }

    // change sphere grabbedBy to '' and hide to True
    for (let i = 0; i <= actualRoom.gameStatus.spheres.length - 1; i++) {
        if (sphere.id === actualRoom.gameStatus.spheres[i].id) {
            actualRoom.gameStatus.spheres[i].grabbedBy = '';
            actualRoom.gameStatus.spheres[i].hide = true;
            break;
        }
    }

    // change sphereSocket empty to false and color to 'blue'
    for (let i = 0; i <= actualRoom.gameStatus.map.length - 1; i++) {
        if (sphereSocket.id === actualRoom.gameStatus.map[i].id) {
            actualRoom.gameStatus.map[i].empty = false;
            actualRoom.gameStatus.map[i].color = "blue";
            break;
        }
    }

    // add points to team
    if (player.side === "Angel") {
        actualRoom.gameStatus.angelPoints += 1;
    } else {
        actualRoom.gameStatus.demonPoints += 1;
    }

    checkForWinner(actualRoom, "socketPoints");

    return actualRoom;
}

export const playerTransformWarrior = (room, player, warriorPedestal) => {

    let playerSide = null;
    let playerName = null;

    // change player modeWarrior to true and sphereGrabbed to False
    for (let j = 0; j <= room.gameStatus.players.length - 1; j++) {
        if ((room.gameStatus.players[j].name === player.name) && !room.gameStatus.players[j].modeWarrior) {
            room.gameStatus.players[j].modeWarrior = true;
            room.gameStatus.players[j].sphereGrabbed = false;
            playerSide = room.gameStatus.players[j].side;
            playerName = room.gameStatus.players[j].name;
            break;
        }
    }

    // change warriorPedestal activated to true and side to player's side
    for (let i = 0; i <= room.gameStatus.map.length - 1; i++) {
        if (playerSide && (warriorPedestal.id === room.gameStatus.map[i].id)) {
            room.gameStatus.map[i].activated = true;
            room.gameStatus.map[i].color = "yellow";
            room.gameStatus.map[i].side = playerSide;
            break;
        }
    }

    // change sphere grabbedBy to '' and hide to True
    for (let i = 0; i <= room.gameStatus.spheres.length - 1; i++) {
        if (playerName && (playerName === room.gameStatus.spheres[i].grabbedBy)) {
            room.gameStatus.spheres[i].grabbedBy = '';
            room.gameStatus.spheres[i].hide = true;
            break;
        }
    }

    return room;
}

export const playerRespawner = (player, room) => {

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

//  check if there is a winner
const checkForWinner = (actualRoom, mode) => {

    switch (mode) {
        case "socketPoints":   
            //  check if team won already by the count of spheres inserted
            if (actualRoom.gameStatus.angelPoints === 13) {
                actualRoom.gameStatus.winner = "Angel";
                actualRoom.gameStatus.gameFinished = true;
            } else if (actualRoom.gameStatus.demonPoints === 13) {
                actualRoom.gameStatus.winner = "Demon";
                actualRoom.gameStatus.gameFinished = true;
            }
            break;
        case "kills":
            //  check if team won already by the count of enemy king killed
            if (actualRoom.gameStatus.demonKills === 3) {
                actualRoom.gameStatus.winner = "Demon";
                actualRoom.gameStatus.gameFinished = true;
            } else if (actualRoom.gameStatus.angelKills === 3) {
                actualRoom.gameStatus.winner = "Angel";
                actualRoom.gameStatus.gameFinished = true;
            }
        default:
            break;

    }
}