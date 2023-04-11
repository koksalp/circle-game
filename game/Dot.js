export default class Dot {
  constructor(x, y, radius, color, id, canvas) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.id = id;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fill();
  } 
}
