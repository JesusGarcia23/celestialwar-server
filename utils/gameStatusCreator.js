import { Resource } from '../models/Resource';
import { generatePlatforms, generateSpheres } from '../utils/levelCreator';
import { generatePlayers } from '../utils/playerCreator';
import { forestPlatForms, forestSpheres } from '../templates/maps/forest/resources';


 export const createGameStatus = (settings, angelTeam, demonTeam) => {

        let map = [];
        let spheres = [];
        let players = generatePlayers(angelTeam, demonTeam);

        switch(settings.map) {
            case 'forest': 
                map = generatePlatforms(forestPlatForms);
                spheres = generateSpheres(forestSpheres);
                break;
            default:
                return;
        }

        let newGameStatus = {
            angelKills: 0,
            demonKills: 0,
            angelPoints: 0,
            demonPoints: 0,
            winner : "",
            gameFinished: false,
            players,
            spheres,
            map,
        };

        return newGameStatus;

    }