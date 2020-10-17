import { Angel, Demon, King } from '../models/Character';

export const generatePlayers = (listOfPlayers) => {
    console.log(listOfPlayers)
    return listOfPlayers.map(player => {
        switch(player.type){
            case "Angel": {
                return new Angel(player.name, player.x, player.y, player.width, player.height, player.sprite, player.direction, player.deployX, player.deployY);
            }
            case "Demon": {
                return new Demon(player.name, player.x, player.y, player.width, player.height, player.sprite, player.direction, player.deployX, player.deployY);
            }
            case "Archangel": {
                return new King(player.name, player.x, player.y, player.width, player.height, player.sprite, player.direction, player.deployX, player.deployY);
            }
            default: 
                break;
        }
    })
}