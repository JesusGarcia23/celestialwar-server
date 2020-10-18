import { Angel, Demon, King, defaultAngelValues, defaultDemonValues } from '../models/Character';

export const generatePlayers = (angelTeam, demonTeam) => {

    let newAngelTeam = angelTeam.map((player, index) => {
        if (index === 0) {
            return new King(player.username, defaultAngelValues[index].x, defaultAngelValues[index].y, defaultAngelValues[index].width, defaultAngelValues[index].height, defaultAngelValues[index].sprite, defaultAngelValues[index].direction, defaultAngelValues[index].deployX, defaultAngelValues[index].deployY, "angel");
        } else {
            return new Angel(player.username, defaultAngelValues[index].x, defaultAngelValues[index].y, defaultAngelValues[index].width, defaultAngelValues[index].height, defaultAngelValues[index].sprite, defaultAngelValues[index].direction, defaultAngelValues[index].deployX, defaultAngelValues[index].deployY, "angel");
        }
    })

    let newDemonTeam = demonTeam.map((player, index) => {
        if (index === 0) {
            return new Demon(player.username, defaultAngelValues[index].x, defaultAngelValues[index].y, defaultAngelValues[index].width, defaultAngelValues[index].height, defaultAngelValues[index].sprite, defaultAngelValues[index].direction, defaultAngelValues[index].deployX, defaultAngelValues[index].deployY, "demon");
        } else {
            return new Angel(player.username, defaultAngelValues[index].x, defaultAngelValues[index].y, defaultAngelValues[index].width, defaultAngelValues[index].height, defaultAngelValues[index].sprite, defaultAngelValues[index].direction, defaultAngelValues[index].deployX, defaultAngelValues[index].deployY, "demon");
        }
    })

    let playersToPlay = [...newAngelTeam, ...newDemonTeam];

    return playersToPlay;

}