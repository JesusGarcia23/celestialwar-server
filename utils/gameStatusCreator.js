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
            players,
            spheres,
            map,
        };

        return newGameStatus;

    }