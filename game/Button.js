export default class Btn {
  constructor(x, y, width, height, text, backgroundColor, textColor, textPaddingLeft, textPaddingBottom, font, canvas) { 
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.backgroundColor = backgroundColor;
    this.textColor = textColor; 
    this.textPaddingLeft = textPaddingLeft; 
    this.textPaddingBottom = textPaddingBottom; 
    this.font = font; 
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
  }

  draw() {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.font = this.font; 
    this.ctx.fillStyle = this.textColor; 
    this.ctx.fillText(this.text, this.x + this.textPaddingLeft, this.y + this.height-this.textPaddingBottom); 
  }

  checkIfClicked(clickX, clickY) { 
    return (
      clickX > this.x &&
      clickX < this.x + this.width &&
      clickY > this.y &&
      clickY < this.y + this.height
    );
  }
}
