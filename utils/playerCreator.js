import { Angel, Demon, King, defaultAngelValues, defaultDemonValues } from '../models/Character';

export const generatePlayers = (angelTeam, demonTeam) => {

    let newAngelTeam = angelTeam.map((player, index) => {
        if (index === 0) {
            return {
                name: player.username, 
                x: defaultAngelValues[index].x, 
                y: defaultAngelValues[index].y, 
                width: defaultAngelValues[index].width, 
                height: defaultAngelValues[index].height, 
                direction: defaultAngelValues[index].direction,
                deployX: defaultAngelValues[index].deployX, 
                deployY: defaultAngelValues[index].deployY, 
                side: "Angel",
                alive: true,
                sphereGrabbed: false,
                onFloor: true,
                king: false,
                kills: 0,
                modeWarrior: false,
            }
        } else {
            return {
                name: player.username, 
                x: defaultAngelValues[index].x, 
                y: defaultAngelValues[index].y, 
                width: defaultAngelValues[index].width, 
                height: defaultAngelValues[index].height, 
                direction: defaultAngelValues[index].direction,
                deployX: defaultAngelValues[index].deployX, 
                deployY: defaultAngelValues[index].deployY, 
                side: "Angel",
                alive: true,
                sphereGrabbed: false,
                onFloor: true,
                king: false,
                kills: 0,
                modeWarrior: false,
            }
        }
    })

    let newDemonTeam = demonTeam.map((player, index) => {
        if (index === 0) {
            return {
                name: player.username, 
                x: defaultDemonValues[index].x, 
                y: defaultDemonValues[index].y, 
                width: defaultDemonValues[index].width, 
                height: defaultDemonValues[index].height, 
                direction: defaultDemonValues[index].direction,
                deployX: defaultDemonValues[index].deployX, 
                deployY: defaultDemonValues[index].deployY, 
                side: "Demon",
                alive: true,
                sphereGrabbed: false,
                onFloor: true,
                king: true,
                kills: 0,
                modeWarrior: true,
            }
        } else {
            return {
                name: player.username, 
                x: defaultDemonValues[index].x, 
                y: defaultDemonValues[index].y, 
                width: defaultDemonValues[index].width, 
                height: defaultDemonValues[index].height, 
                direction: defaultDemonValues[index].direction,
                deployX: defaultDemonValues[index].deployX, 
                deployY: defaultDemonValues[index].deployY, 
                side: "Demon",
                alive: true,
                sphereGrabbed: false,
                onFloor: true,
                king: false,
                kills: 0,
                modeWarrior: false,
            }
        }
    })

    let playersToPlay = [...newAngelTeam, ...newDemonTeam];

    return playersToPlay;

};