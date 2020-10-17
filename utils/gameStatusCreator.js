import { Resource } from '../models/Resource';
import { generateResources } from '../utils/levelCreator';
import { generatePlayers } from '../utils/playerCreator';
import { forestPlatForms } from '../templates/maps/forest/resources';


 export const createGameStatus = (settings, angelTeam, demonTeam) => {
        console.log("CREATE GAME STATUS")
        console.log(settings);
        let newGameStatus = {};
        let map = [];
        let players = generatePlayers([...angelTeam, ...demonTeam]);

        switch(settings.map) {
            case 'forest': 
                map = generateResources(forestPlatForms);
                break;
            default:
                return;
        }

        console.log(players);
        // console.log(players)
    }