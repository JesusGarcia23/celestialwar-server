export class WarriorPedestal {
    constructor(id, width, height, x, y) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.type = 'warrior-pedestal';
        this.x = x;
        this.y = y;
        this.activated = false;
        this.side = null;
        this.color = 'brown'
    }

    drawPedestal = (ctx) => {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}