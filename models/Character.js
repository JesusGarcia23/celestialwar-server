// DO NOT USE THIS ONE

class General {
    constructor(name, x, y, width, height, sprite, color, direction, deployX, deployY, side) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
        this.color = color;
        this.alive = true;
        this.side = side;
        this.sphereGrabbed = false;
        this.direction = direction;
        this.deployX = deployX;
        this.deployY = deployY;
        this.modeWarrior = false;
        this.king = false;
        this.jumped = false;
        this.clashing = false;
        this.powerJump = 20;
        this.totalJumped = 0;
        this.onFloor = false;
        this.kills = 0;
    }

    touchingCheck(obj, gameStatus) {

        // CHECK TOUCHING OTHER PLAYERS
        if(!obj.type){
            if(this.modeWarrior){
                return this.attack(obj, gameStatus);
            }else if(obj.modeWarrior === true){
                this.receiveDamage();
            }
            return false;
        }
        // CHECK FOR WARRIOR PEDESTALS
        if(obj.type === 'warrior-pedestal'){
            return false;
        }
        return true;
    }

    sphereCollision(circle){
            let distX = Math.abs(circle.x - this.x - this.width / 2);
            let distY = Math.abs(circle.y - this.y - this.height / 2);
    
            if (distX > (this.width / 2 + circle.radius)) { return false; }
            if (distY - 10 > (this.height / 2 + circle.radius)) { return false; }
        
            if (distX <= (this.width / 2 )) { return true; } 
            if (distY <= (this.height /2 )) { return true; }
        
            let dx= distX - this.width / 2;
            let dy= distY - this.height / 2;
            return ( dx*dx+dy*dy <= (circle.radius*circle.radius));
    }


    handleInsertSphere = (socket, spheres, gameStatus) => {
        let sphereGrabbed = spheres.filter(sphere => sphere.grabbedBy === this.name);
        let touched =  this.sphereCollision(socket);
        if (touched && this.sphereGrabbed && socket.side === this.side && socket.empty && sphereGrabbed.length > 0) {
            if (this.side === "Angel") {
                gameStatus.angelSpheresCollected += 1;
            } else if (this.side === "Demon") {
                gameStatus.demonSpheresCollected += 1;
            }
            sphereGrabbed[0].grabbedBy = "";
            this.sphereGrabbed = false;
            socket.empty = false;
            socket.color = "blue";
        }
    }
    
    checkCollision = (obj, spheres, gameStatus) => {
        if(obj.radius !== null && obj.type === 'sphere'){
            let touched = this.sphereCollision(obj);
            if(touched && !this.sphereGrabbed && !this.modeWarrior && !obj.hide){
                obj.beGrabbed(this.name);
                this.sphereGrabbed = true;
            }

        }
        if(obj.type === "sphere-collector"){
            return false;
        }
        
        // RIGHT
        if( ( this.x + this.width + 2 > obj.x) && this.x < obj.x && (this.y + this.height > obj.y) && (this.y < obj.y + obj.height) && this.direction === 'RIGHT'){
            return this.touchingCheck(obj, gameStatus);
        }// LEFT
        else if( (this.x < obj.x + obj.width + 2) && this.x > obj.x && (this.y + this.height > obj.y + 8) && (this.y < obj.y + obj.height) && this.direction === 'LEFT'){
            return this.touchingCheck(obj, gameStatus);
        }// UP      
        else if( (this.y - 7 < obj.y + obj.height + 7) && (this.x + this.width > obj.x + 4) && (this.x < obj.x + obj.width) && this.direction === 'UP'){
            return this.touchingCheck(obj, gameStatus);
        }// BOTTOM
        else if((this.y + this.height + 2 > obj.y) && (this.x > obj.x) && (this.y < obj.y) && (this.x + this.width < obj.x + obj.width) && this.direction === 'DOWN'){
            return this.touchingCheck(obj, gameStatus);
        }
        return false;
    }

    hitTop = (obj, spheres, gameStatus) => {
        if(obj.type === "sphere-socket") {
            this.handleInsertSphere(obj, spheres, gameStatus)
        }
        if(obj.type === "sphere-collector") {
            return false;
        }
        if(this.y < 10) {
            return true;
        }

        if( (this.y - 7 < obj.y + obj.height + 7) && (this.x + this.width > obj.x + 4) && (this.x < obj.x + obj.width) && (this.y > obj.y)){
            return true;
        }
        return false;
    }

    hitBottom = (obj) => {
        if(obj.type === 'warrior-pedestal'){
            return false;
        }
        if(obj.type === "sphere-collector") {
            return false;
        }
        
         if((this.y + this.height + 4 > obj.y) && (this.x + 5 > obj.x) && (this.y < obj.y) && ( (this.x + this.width - 5) < obj.x + obj.width )){
            this.onFloor = true;
            this.totalJumped = 0;
            return true;
        }else{
            this.onFloor = false;
        }
        return false;
    }

    checkPedestal = (obj) => {
        if( ( this.x + this.width + 2 > obj.x) && this.x < obj.x && (this.y + this.height > obj.y) && (this.y < obj.y + obj.height)){
            return {touched: true, obj};
        }// LEFT
        else if( (this.x < obj.x + obj.width + 2) && this.x > obj.x && (this.y + this.height > obj.y + 8) && (this.y < obj.y + obj.height)){
            return {touched: true, obj};
        }
        return {touched: false, obj};
    }

    receiveDamage = () => {
        this.alive = false;
        if (!this.king) {
            this.modeWarrior = false;
        }
        this.sphereGrabbed = false;
        setTimeout(() => {
            this.x = this.deployX;
            this.y = this.deployY;
            this.alive = true;
        }, 2500)
    };

    bounceEffect = (resources) => {
        let touched = null;

        touched = resources.map(resource => {
            return this.checkCollision(resource);
        })

        if(touched.indexOf(true) < 0){
            if(this.direction === "RIGHT") {
                this.x -= 10;
            }
            else if(this.direction === "LEFT") {
                this.x += 10;
            }

         }else{
            if(this.direction === "RIGHT") {
                this.x += 10;
            }
            else if(this.direction === "LEFT") {
                this.x -= 10;
            }
         }

        setTimeout(() => {
            this.clashing = false;
        },100)
    }

    
    attack = (otherPlayer, gameStatus) => {
        if(!otherPlayer.alive){
            return false;
        }
        if(!otherPlayer.modeWarrior){
            otherPlayer.receiveDamage();
        }else if(otherPlayer.modeWarrior){
            if(otherPlayer.direction !== this.direction){
                otherPlayer.clashing = true;
                this.clashing = true;
                return true;
            }else{
                if(otherPlayer.king){
                    if(this.side === "Angel") {
                        gameStatus.demonDeath += 1;
                    }else if(this.side === "Demon") {
                        gameStatus.archangelDeath += 1;
                    }
                    this.kills += 1;
                }
                otherPlayer.receiveDamage();
            }
        } 
    };

    drawCharacter = (ctx) => {
        ctx.fillStyle = !this.modeWarrior ? this.color : (!this.king ? 'purple' : 'yellow');
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = 'orange';
        ctx.font = 'bold 12px serif';
        ctx.fillText(`${this.name}`, this.x + 12, this.y - 10);
        ctx.textAlign = "center";

        // const characterSprite = new Image();
        // characterSprite.src = this.sprite;
        // createContext.drawImage(characterSprite, this.x, this.y, this.width, this.height)
    };


}

export class Angel extends General {
    constructor(name, x, y, width, height, sprite, direction, deployX, deployY) {
        super(name,x, y, width, height, sprite, direction);
        this.jumped = false;
        this.side = 'Angel';
        this.direction = direction;
        this.deployX = deployX;
        this.deployY = deployY;
        this.color = 'blue';
    }

}

export class Demon extends General {
    constructor(name, x, y, width, height, sprite, direction, deployX, deployY) {
        super(name,x, y, width, height, sprite,direction);
        this.jumped = false;
        this.side = 'Demon';
        this.direction = direction;
        this.deployX = deployX;
        this.deployY = deployY;
        this.color = 'red';
        this.king = true;
    }
}

export class King extends General {
    constructor(name, x, y, width, height, sprite, direction, deployX, deployY, side){
        super(name, x, y, width, height, sprite, direction, deployX, deployY, side);
        this.direction = direction;
        this.deployX = deployX;
        this.deployY = deployY;
        this.modeWarrior = true;
        this.color = "yellow";
        this.side = side;
        this.king = true;
    }
}

export const defaultAngelValues = [
    {x: 40, y: 0, width: 1.2, height: 5, sprite: "A", direction: 'RIGHT', deployX: 40, deployY: 0 },
    {x: 43, y: 0, width: 1.2, height: 5, sprite: "A", direction: 'RIGHT', deployX: 43, deployY: 0 },
    {x: 45, y: 0, width: 1.2, height: 5, sprite: "A", direction: 'RIGHT', deployX: 45, deployY: 0 },
    {x: 47, y: 0, width: 1.2, height: 5, sprite: "A", direction: 'RIGHT', deployX: 47, deployY: 0 },
    {x: 49, y: 0, width: 1.2, height: 5, sprite: "A", direction: 'RIGHT', deployX: 49, deployY: 0 },
]

export const defaultDemonValues = [
    {x: 53, y: 0, width: 1.2, height: 5, sprite: "B", direction: 'RIGHT', deployX: 53, deployY: 0 },
    {x: 55, y: 0, width: 1.2, height: 5, sprite: "B", direction: 'RIGHT', deployX: 55, deployY: 0 },
    {x: 57, y: 0, width: 1.2, height: 5, sprite: "B", direction: 'RIGHT', deployX: 57, deployY: 0 },
    {x: 59, y: 0, width: 1.2, height: 5, sprite: "B", direction: 'RIGHT', deployX: 59, deployY: 0 },
    {x: 61, y: 0, width: 1.2, height: 5, sprite: "B", direction: 'RIGHT', deployX: 61, deployY: 0 },
]