export class Resource {
    constructor(canvas, name, type, id , width, height, x, y, color, xPreference, yPreference){
        this.canvas = canvas;
        this.name = name;
        this.type = type;
        this.id = id;
        this.width = width;
        this.height = height;
        this.x = this.setPosition(x, width, canvas.width, xPreference);
        this.y = this.setPosition(y, height, canvas.height, yPreference);
        this.color = color;
        this.xPreference = xPreference;
        this.yPreference = yPreference;
    }

    setPosition(position, objectDimension, canvasDimension, fixedPosition){
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

    drawPlatform = (ctx, modeDevelop) => {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if(modeDevelop){
            ctx.fillStyle = 'orange';
            ctx.font = 'bold 12px serif';
            ctx.fillText(`ID: ${this.id}`, this.x + 10, this.y + 15);
        }
    }
}