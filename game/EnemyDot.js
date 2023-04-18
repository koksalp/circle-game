import Dot from "./Dot.js";

export default class EnemyDot extends Dot { 
  constructor(targetX, targetY, id, mode, canvas) { 
    super(null, null, null, null, id, canvas);
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d"); 
    this.targetX = targetX;
    this.targetY = targetY; 
    this.mode = mode; 
    [this.radiusMin, this.radiusMax] = [20, 30]; 
    [this.minVelocity, this.maxVelocity] = [1, 3]; 
    this.init();
    [this.velocityX, this.velocityY] = this.generateRandomVelocity();
  }

  init() { 
    if (this.mode === "normal") { console.log("enemy dot class normal created"); 
      [this.radiusMin, this.radiusMax] = [20, 30]; 
      [this.minVelocity, this.maxVelocity] = [3, 5];
    } else if (this.mode === "hard") {console.log("enemy dot class hard created"); 
      [this.radiusMin, this.radiusMax] = [30, 40]; 
      [this.minVelocity, this.maxVelocity] = [20, 30];
    } else if (this.mode === "extreme") {console.log("enemy dot class extreme created"); 
      [this.radiusMin, this.radiusMax] = [20, 30]; 
      [this.minVelocity, this.maxVelocity] = [80, 100];
    } 
    this.radius = this.generateRandomRadius();
    this.color = this.generateRandomColor();
    [this.x, this.y] = this.generateRandomCoordinates(); 
  } 

  static getRandomInteger(min, max) { 
    // lower boundary cannot be bigger than upper boundary

    if (min > max) {
      return;
    }

    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static addTrailingZero(str) {
    str = str.toString();

    if (str.length === 1) {
      return "0" + str;
    }
    return str;
  }

  generateRandomColor(alpha = 1) {
    if (typeof alpha !== "number" || alpha > 1 || alpha < 0) {
      return "#f0f0f0";
    }

    const colorLength = 3;
    let randomColor = "";

    for (let i = 0; i < colorLength; i++) {
      randomColor += EnemyDot.addTrailingZero(
        EnemyDot.getRandomInteger(0, 255).toString(16)
      );
    }

    alpha = alpha === 1 ? "" : Math.ceil(255 * alpha).toString(16);

    return ("#" + randomColor + alpha).toUpperCase();
  }

  static getRandomElement(array) {
    const random = Math.floor(Math.random() * array.length);
    return array[random];
  }

  generateRandomRadius() {
    return EnemyDot.getRandomInteger(this.radiusMin, this.radiusMax);
  }

  generateRandomCoordinate(x = true) {
    /* 
    const dim = x ? "width" : "height";

    return EnemyDot.getRandomInteger(
      this.radius * -1,
      this.canvas[dim] + this.radius, 
    ); */

    const dim = x ? "width" : "height";
    cont[(min, max)] = [this.radius * -1, this.canvas[dim] + this.radius];
  }

  generateRandomCoordinates() {
    const [minX, maxX] = [this.radius * -1, this.canvas.width + this.radius];
    const [minY, maxY] = [this.radius * -1, this.canvas.height + this.radius];

    const [randomX, randomY] = [
      EnemyDot.getRandomInteger(minX, maxX),
      EnemyDot.getRandomInteger(minY, maxY),
    ]; 

    const possibilities = [
      [minX, randomY], 
      [maxX, randomY], 
      [randomX, minY], 
      [randomX, maxY], 
    ] ; 

    return EnemyDot.getRandomElement(possibilities); 
  }

  generateRandomVelocity() {
    const [distanceX, distanceY] = this.getDistances();
    const velocityRatio = Math.abs(distanceX / distanceY);
    this.velocityRatio = velocityRatio; //
    let velocityX, velocityY;
    if (velocityRatio > 1) {
      velocityX = EnemyDot.getRandomInteger(this.minVelocity, this.maxVelocity);
      velocityY = velocityX / velocityRatio;
    } else {
      velocityY = EnemyDot.getRandomInteger(this.minVelocity, this.maxVelocity);
      velocityX = velocityY * velocityRatio;
    }

    return [
      distanceX < 0 ? velocityX * -1 : velocityX,
      distanceY < 0 ? velocityY * -1 : velocityY,
    ];
  }

  // calculates velocityX / velocityY ratio
  getDistances(targetX, targetY) {
    if (targetX === undefined || targetY === undefined) {
      return [this.targetX - this.x, this.targetY - this.y];
    } else {
      const [distanceX, distanceY] = [this.x - targetX, this.y - targetY];
      return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    }
  } 
  
  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  } 

  checkIfOut() {
    return (
      this.x + this.radius <= 0 ||
      this.x - this.radius >= this.canvas.width ||
      this.y + this.radius <= 0 ||
      this.y - this.radius >= this.canvas.height
    );
  }

  checkIfHit(playerX, playerY, playerRadius) {
    const distance = this.getDistances(playerX, playerY);
    // console.log("distance", distance, "this.radius", this.radius, "player.radius", playerRadius);
    return distance < this.radius + playerRadius;
  } 
}
