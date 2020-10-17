export class Resource {
    constructor(name, type, id , width, height, x, y, color, xPreference, yPreference){
        this.name = name;
        this.type = type;
        this.id = id;
        this.width = width;
        this.height = height;
        this.x = x
        this.y = y;
        this.color = color;
        this.xPreference = xPreference;
        this.yPreference = yPreference;
    }

    setPosition(position, objectDimension, fixedPosition, canvasDimension){
        switch(fixedPosition){
            case 'center': {
                return (canvasDimension / 2) - (objectDimension / 2);
            }
            case 'start': {
                return 0;
            }
            case 'end': {
                return (canvasDimension - objectDimension);
            }
            default: 
            return position;
        }
        
    }

    drawPlatform = (ctx, modeDevelop, canvas) => {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.setPosition(this.x, this.width, this.xPreference, canvas), this.setPosition(this.y, this.height, this.yPreference, canvas), this.width, this.height);
        if(modeDevelop){
            ctx.fillStyle = 'orange';
            ctx.font = 'bold 12px serif';
            ctx.fillText(`ID: ${this.id}`, this.x + 10, this.y + 15);
        }
    }
}