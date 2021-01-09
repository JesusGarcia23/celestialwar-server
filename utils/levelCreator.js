import { Resource } from '../models/Resource';
import { WarriorPedestal } from '../models/WarriorPedestal';
import { Sphere, SphereGenerator, SphereCollector, SphereCollectorSocket } from '../models/Sphere';


export const generatePlatforms = (listOfPlatforms) => {

        return listOfPlatforms.map((resource, index) => {
            switch(resource.type) {
                case 'platform': {
                    return new Resource(resource.name, resource.type, index + 1, resource.width, resource.height, resource.x, resource.y, resource.color, resource.xPreference, resource.yPreference);
                }
                case 'warrior-pedestal': {
                    return new WarriorPedestal(resource.width, resource.height, resource.x, resource.y)
                }
                case 'sphere-generator': {
                    return new SphereGenerator(resource.name, resource.type, resource.x, resource.y);
                }
                case 'sphere-collector': {
                    return new SphereCollector(resource.x, resource.y,resource.width, resource.height, resource.side)
                }
                case 'sphere-socket': {
                    return new SphereCollectorSocket(resource.id, resource.x, resource.y, resource.radius, resource.side)
                }
                default: 
                    return null;
            }
        });
}

export const generateSpheres = (listOfSpheres) => {

    return listOfSpheres.map(sphereToCreate => {
        return new Sphere(sphereToCreate.id, sphereToCreate.radius, sphereToCreate.x, sphereToCreate.y, sphereToCreate.color)
    })

}