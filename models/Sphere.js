// Regular Spheres

export class Sphere {
    constructor(id, radius, x, y) {
        this.id = id;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.hide = false;
        this.grabbedBy = '';
        this.type = "sphere";
        this.color = "blue";
    }

    drawSphere = (ctx, players) => {
        
    if(this.grabbedBy !== '' && players.length > 0) {
        const ownerIndex = players.findIndex(player => player.name === this.grabbedBy)
        const owner = players[ownerIndex];
        if(owner.alive){
            this.x = owner.x;
            this.y = owner.y;
            this.color = 'transparent';
        }else{
            this.grabbedBy = '';
            this.color = 'blue';
        }
    }
    ctx.beginPath();
      ctx.arc(this.x, this.y,this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }

    beGrabbed = (playerName) => {
        if(!this.hide){
            this.grabbedBy = playerName;
            this.hide = true;
        }
    }
}

//  Spheres will be re generated (NOT IMPLEMENTED YET) !!!!!!!!!!!!!!!
export class SphereGenerator {
    constructor(name, type, x, y){
        this.name = name;
        this.type = type;
        this.x = x;
        this.y = y;
        this.counter = 6;
    }

    drawContainer = (ctx) => {
        ctx.fillStyle = 'grey';
        ctx.fillRect(this.x, this.y, 40, 40);
    }

    refillContainer = (ctx) => {

    }

}

// Team Sphere Containers

export class SphereCollector {
    constructor(x, y, width, height, side){
        this.type = "sphere-collector";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "";
        this.side = side;
        this.quantity = 0;
        this.sockets = [{x: 40, y:45, radius: 5}];
    }


    drawSphereCollector = (ctx) => {
        ctx.fillStyle = this.side === "Angel" ? "purple" : "Orange";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // this.generateSockets(ctx)
    }

    generateSockets = (ctx) => {
  
        if(this.sockets.length > 0) {
            this.sockets.map(socket => {
                ctx.beginPath();
                ctx.arc(this.x + socket.x, this.y + socket.y, socket.radius, 0, Math.PI * 2);
                ctx.fillStyle = "lightgray";
                ctx.fill();
                ctx.lineWidth = 3;
                ctx.strokeStyle = "lightgray";
                ctx.stroke();
            })
        }
    }
}

// Team Sphere Containers (Sockets)

export class SphereCollectorSocket {
    constructor(id, x, y, radius, side) {
        this.id = id;
        this.type = "sphere-socket";
        this.empty = true;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.side = side;
        this.color = "darkgray"
    }

    drawSphereCollectorSocket = (ctx) => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
}