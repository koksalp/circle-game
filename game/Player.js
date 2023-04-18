import Dot from "./Dot.js";

export default class Player extends Dot { 

  constructor(x, y, radius, color, id, playerKeys, playerNumber, canvas) { 
    super(x, y, radius, color, id, canvas); 

    [this.upKey, this.downKey, this.leftKey, this.rightKey] = playerKeys; 
    this.playerNumber= playerNumber; 
    this.velocity = 50; 
  }

  static defaultPlayerRadius = 20; 
  static defaultPlayerColor = "white"; 
  handleKeyPress(key) {
    if (key === this.upKey) {
      if (this.y > this.radius + this.velocity) {
        this.y -= this.velocity;
      } else {
        this.y = this.radius;
      }
    } else if (key === this.downKey) {
      if (this.y + this.radius + this.velocity < this.canvas.height) {
        this.y += this.velocity;
      } else {
        this.y = this.canvas.height - this.radius;
      }
    } else if (key === this.leftKey) {
      if (this.x > this.radius + this.velocity) {
        this.x -= this.velocity;
      } else {
        this.x = this.radius;
      }
    } else if (key === this.rightKey) {
      if (this.x + this.radius + this.velocity < this.canvas.width) {
        this.x += this.velocity;
      } else {
        this.x = this.canvas.width - this.radius;
      }
    }
  } 
  
  static getDefaultPlayerRadius(canvasWidth, canvasHeight) { 
    const ratio = 25; 
    
    if (canvasWidth < canvasHeight) { console.log("w<h: ", Math.ceil(canvasWidth / ratio))
      return Math.ceil(canvasWidth / ratio); 
    }
    console.log("h<w: ", Math.ceil(canvasWidth / ratio))
    return Math.ceil(canvasHeight / ratio);
  }
}
