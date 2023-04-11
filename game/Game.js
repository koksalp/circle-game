import Player from "./Player.js";
import EnemyDot from "./EnemyDot.js";
import Btn from "./Button.js";

export default class Game {
  static id = 0;
  playerKeys = [
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
    ["w", "s", "a", "d"],
    ["u", "j", "h", "k"],
    ["8", "5", "4", "6"],
  ];
  playerDistance = 100;
  gameOverButtonsArray = [];
  playerSelectionButtonsArray = []; 
  difficultyButtonsArray = [] ; 
  send = true;
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 30;
    this.playersArray = [];
    this.enemiesArray = [];
    this.numberOfPlayers = 1;
    this.mode = "easy"; 
    this.fps = 30;
    this.sendEnemyDuration = 1 ; 
    this.count = this.fps * this.sendEnemyDuration;
    this.gameBegin = false; 
    this.playerNumSelected = false; 
    this.difficultySelected = false; 
    this.gameOver = false;
    this.winner = null;
    this.message = {
      message: null,
      delete: true,
    }; 
    document.onkeydown = this.handleKeyPress.bind(this);
    document.onclick = this.handleMouseClick.bind(this);
  }

  init() { 
    if (!this.playerNumSelected) {
      this.displayScreen("menu");
    } else if (!this.difficultySelected) {
      this.displayScreen("difficulty");
    } else if (this.gameBegin ) { console.log("GAME BEGIN ", "MODE : ", this.mode); 
      console.log("init called"); 
      this.playersArray = [];
      this.enemiesArray = [];
      this.createPlayers({});
      this.gameOver = false;
      this.gameOverButtons = this.createGameOverButtons();
      this.timer = setInterval(this.loop.bind(this), 1000 / this.fps);
    } 
  }

  reset() {
    clearInterval(this.timer);
    this.init();
  }

  loop() {
    this.update();
    this.draw();
  }

  update() {
    if (!this.gameOver) {
      //console.log("array length: ", this.playersArray.length);
      this.enemiesArray.forEach((enemy) => {
        enemy.update();

        if (enemy.checkIfOut()) {
          this.removeEnemy(enemy.id);
        } else {
          this.playersArray.forEach((player, index) => {
            if (enemy.checkIfHit(player.x, player.y, player.radius)) {
              this.winner = player.playerNumber;
              this.removePlayer(player.id);
              if (this.playersArray.length === 0) {
                // this.reset();
                this.gameOver = true;
              } else {
                this.message.message = `Player ${player.playerNumber} is dead.`;
              } 
            }
          });
        }
      });

      if (this.count >= this.fps * this.sendEnemyDuration) {
        this.createEnemy();
        this.count = 0;
      } else {
        this.count++;
      }
    }
  }

  draw() {
    this.clearCanvas();

    if (this.gameOver) {
      this.displayGameOverScreen();
    } else {
      this.playersArray.forEach((player) => {
        player.draw();
      });
      this.enemiesArray.forEach((enemy) => {
        enemy.draw();
      });

      if (this.message.message !== null) {
        this.displayMessage();
      }
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  handleKeyPress(event) {
    event.preventDefault();
    if ((this.gameOver && event.key === "r") || event.key === "R") {
      this.reset();
    } else {
      this.playersArray.forEach((player) => {
        player.handleKeyPress(event.key);
      });
    }
  }

  createEnemy() {
    if (this.send) {
      const randomPlayer = EnemyDot.getRandomElement(this.playersArray);
      const newEnemy = new EnemyDot(
        randomPlayer.x,
        randomPlayer.y,
        this.generateId(),
        this.mode,
        this.canvas
      );
      this.enemiesArray.push(newEnemy); //console.log(newEnemy.mode); 
    } 
  }

  removeEnemy(enemyId) {
    this.enemiesArray = this.enemiesArray.filter(
      (enemy) => enemy.id !== enemyId
    ); // console.log(`enemy with id of ${enemyId} is removed. `) ;
  }

  removePlayer(playerId) {
    this.playersArray = this.playersArray.filter(
      (player) => player.id !== playerId
    );
  }
  generateId() {
    return Game.id++;
  }

  createArrayOfElements(length, element) {
    const array = [];
    for (let i = 0; i < length; i++) {
      array.push(element);
    }

    return array;
  }

  createPlayers({ radiusArray, colorArray }) {
    const [centerX, centerY] = [this.canvas.width / 2, this.canvas.height / 2];

    const playersInitialPlaces = {
      1: [[centerX, centerY]],
      2: [
        [centerX - this.playerDistance / 2, centerY],
        [centerX + this.playerDistance / 2, centerY],
      ],
      3: [
        [centerX - this.playerDistance / 2, centerY + this.playerDistance / 2],
        [centerX + this.playerDistance / 2, centerY + this.playerDistance / 2],
        [centerX, centerY - this.playerDistance / 2],
      ],
      4: [
        [centerX - this.playerDistance / 2, centerY + this.playerDistance / 2],
        [centerX + this.playerDistance / 2, centerY + this.playerDistance / 2],
        [centerX - this.playerDistance / 2, centerY - this.playerDistance / 2],
        [centerX + this.playerDistance / 2, centerY - this.playerDistance / 2],
      ],
    };

    if (
      radiusArray === undefined ||
      !Array.isArray(radiusArray) ||
      radiusArray.length !== this.numberOfPlayers
    ) {
      radiusArray = this.createArrayOfElements(
        this.numberOfPlayers,
        Player.defaultPlayerRadius
      );
    }

    if (
      colorArray === undefined ||
      !Array.isArray(colorArray) ||
      colorArray.length !== this.numberOfPlayers
    ) {
      colorArray = this.createArrayOfElements(
        this.numberOfPlayers,
        Player.defaultPlayerColor
      );
    }

    const initialPlaces = playersInitialPlaces[this.numberOfPlayers];

    initialPlaces.forEach((initialPlace, index) => {
      const newPlayer = new Player(
        initialPlace[0],
        initialPlace[1],
        radiusArray[index],
        colorArray[index],
        this.generateId(),
        this.playerKeys[index],
        index + 1,
        this.canvas
      );
      this.playersArray.push(newPlayer);
    });
  }

  displayGameOverScreen() {
    this.ctx.fillStyle = "#AAAAAA";
    this.ctx.font = "72px serif";
    this.ctx.fillText("GAME OVER", this.canvas.width / 2 - 220, 100);

    if (this.numberOfPlayers > 1) {
      this.ctx.font = "36px serif";
      this.ctx.fillText(
        `PLAYER ${this.winner} WIN`,
        this.canvas.width / 2 - 120,
        160
      );
    }
    this.gameOverButtons.forEach((btn) => {
      btn.draw();
    });
  }

  createGameOverButtons() {
    const [buttonWidth, buttonHeight] = [100, 40];
    const distanceBetweenButtons = 20;
    const distanceY = this.numberOfPlayers > 1 ? 200 : 150;
    const [playAgainButtonX, playAgainButtonY] = [
      this.canvas.width / 2 - buttonWidth - distanceBetweenButtons / 2,
      distanceY,
    ];
    const [menuButtonX, menuButtonY] = [
      this.canvas.width / 2 + distanceBetweenButtons / 2,
      distanceY,
    ];
    const [retryTextPaddingLeft, retryTextPaddingBottom] = [10, 10];
    const [menuTextPaddingLeft, menuTextPaddingBottom] = [15, 10];
    const backgroundColor = "#FFF";
    const textColor = "#000";
    return [
      new Btn(
        playAgainButtonX,
        playAgainButtonY,
        buttonWidth,
        buttonHeight,
        "RETRY",
        backgroundColor,
        textColor,
        retryTextPaddingLeft,
        retryTextPaddingBottom,
        "24px Arial",
        this.canvas
      ),
      new Btn(
        menuButtonX,
        menuButtonY,
        buttonWidth,
        buttonHeight,
        "MENU",
        backgroundColor,
        textColor,
        menuTextPaddingLeft,
        menuTextPaddingBottom,
        "24px Arial",
        this.canvas
      ),
    ];
  }

  handleMouseClick(event) {
    const clientX = event.clientX - (window.innerWidth - this.canvas.width) / 2;
    const clientY = event.clientY;
    if (!this.playerNumSelected) { 
      this.playerSelectionButtonsArray.forEach((btn) => {
        if (btn.checkIfClicked(clientX, clientY)) {
          this.numberOfPlayers = +btn.text; 
          this.playerNumSelected = true; 
          this.init();
        }
      });
    } else if (!this.difficultySelected) { 
      this.difficultyButtonsArray.forEach(btn => {
        if (btn.checkIfClicked(clientX, clientY)) { 
          this.mode = btn.text.toLowerCase(); 
          this.difficultySelected = true; 
          this.gameBegin = true; 
          console.log("mode buttonclicked: ", btn.text.toLowerCase()); 
          this.init(); 
        }
      })
    } else if (this.gameOver) {
      this.gameOverButtons.forEach((btn, index) => {
        if (btn.checkIfClicked(clientX, clientY)) {
          if (index === 0) {
            // retry buttonclicked
            // restart game

            this.reset();
          } else {
            console.log("menu clicked");

            // returnto menu
            this.gameBegin = false;
            this.playerNumSelected = false; 
            this.difficultySelected = false; 
            this.reset();
          }
        }
      });
    }
  }

  displayMessage(color = "white", time = 1000) {
    if (this.message.message !== null) {
      this.ctx.fillStyle = color;
      this.ctx.font = "36px Arial";
      this.ctx.fillText(this.message.message, this.canvas.width / 2 - 100, 100);

      if (this.message.delete) {
        setTimeout(() => {
          this.message.message = null;
          this.message.delete = true;
        }, time);
        this.message.delete = false;
      }
    }
  }

  displayMenu() {
    this.clearCanvas();
    const headerText = "HOW MANY PLAYERS";
    this.ctx.font = "48px Arial";
    this.ctx.fillStyle = "white";

    const headerTextMetrics = this.ctx.measureText(headerText);
    const headerTextMarginTop = 50;
    this.ctx.fillText(
      headerText,
      (this.canvas.width - headerTextMetrics.width) / 2,
      headerTextMetrics.actualBoundingBoxAscent + headerTextMarginTop
    );

    const centerX = this.canvas.width / 2;
    const [buttonWidth, buttonHeight] = [70, 70];
    const distanceBetweenButtons = 50;
    const distanceBetweenHeaderText =
      headerTextMetrics.actualBoundingBoxAscent + headerTextMarginTop + 100;

    const buttonsShared = {
      backgroundColor: "white",
      textColor: "black",
      font: "48px Arial",
    };

    const buttons = {
      button1: {
        x: centerX - buttonWidth - distanceBetweenButtons / 2,
        y: distanceBetweenHeaderText,
        text: "1",
      },
      button2: {
        x: centerX + distanceBetweenButtons / 2,
        y: distanceBetweenHeaderText,
        text: "2",
      },
      button3: {
        x: centerX - buttonWidth - distanceBetweenButtons / 2,
        y: distanceBetweenHeaderText + buttonHeight + distanceBetweenButtons,
        text: "3",
      },
      button4: {
        x: centerX + distanceBetweenButtons / 2,
        y: distanceBetweenHeaderText + buttonHeight + distanceBetweenButtons,
        text: "4",
      },
    };

    const {
      button1: btn1,
      button2: btn2,
      button3: btn3,
      button4: btn4,
    } = buttons;
    this.playerSelectionButtonsArray = [
      new Btn(
        btn1.x,
        btn1.y,
        buttonWidth,
        buttonHeight,
        btn1.text,
        buttonsShared.backgroundColor,
        buttonsShared.textColor,
        20,
        15,
        buttonsShared.font,
        this.canvas
      ),
      new Btn(
        btn2.x,
        btn2.y,
        buttonWidth,
        buttonHeight,
        btn2.text,
        buttonsShared.backgroundColor,
        buttonsShared.textColor,
        20,
        15,
        buttonsShared.font,
        this.canvas
      ),
      new Btn(
        btn3.x,
        btn3.y,
        buttonWidth,
        buttonHeight,
        btn3.text,
        buttonsShared.backgroundColor,
        buttonsShared.textColor,
        20,
        15,
        buttonsShared.font,
        this.canvas
      ),
      new Btn(
        btn4.x,
        btn4.y,
        buttonWidth,
        buttonHeight,
        btn4.text,
        buttonsShared.backgroundColor,
        buttonsShared.textColor,
        20,
        15,
        buttonsShared.font,
        this.canvas
      ),
    ];

    this.playerSelectionButtonsArray.forEach((btn) => {
      btn.draw();
    });
  }

  displayScreen(screen) { 
    this.clearCanvas();

    const headerText =
      screen === "menu" ? "HOW MANY PLAYERS" : "SELECT DIFFICULTY";
    const centerX = this.canvas.width / 2;
 
    this.ctx.font = "48px Arial";
    this.ctx.fillStyle = "white";

    const headerTextMetrics = this.ctx.measureText(headerText);
    const headerTextMarginTop = 50;
    this.ctx.fillText(
      headerText,
      (this.canvas.width - headerTextMetrics.width) / 2,
      headerTextMetrics.actualBoundingBoxAscent + headerTextMarginTop
    );

    const [buttonWidth, buttonHeight] =
      screen === "menu" ? [70, 70] : [150, 50];
    const distanceBetweenButtons = 50;
    const distanceBetweenHeaderText =
      headerTextMetrics.actualBoundingBoxAscent + headerTextMarginTop + 100;

    const buttonsShared = {
      backgroundColor: "white",
      textColor: "black",
      font: `${screen === "menu" ? 48 : 24}px Arial`,
    };

    let buttons;

    if (screen === "menu") {
      buttons = {
        button1: {
          x: centerX - buttonWidth - distanceBetweenButtons / 2,
          y: distanceBetweenHeaderText,
          text: "1",
        },
        button2: {
          x: centerX + distanceBetweenButtons / 2,
          y: distanceBetweenHeaderText,
          text: "2",
        },
        button3: {
          x: centerX - buttonWidth - distanceBetweenButtons / 2,
          y: distanceBetweenHeaderText + buttonHeight + distanceBetweenButtons,
          text: "3",
        },
        button4: {
          x: centerX + distanceBetweenButtons / 2,
          y: distanceBetweenHeaderText + buttonHeight + distanceBetweenButtons,
          text: "4",
        },
      };
    } else {
      buttons = {
        button1: {
          x: centerX - buttonWidth * 2 - distanceBetweenButtons * 3 / 2 , 
          y: distanceBetweenHeaderText,
          text: "EASY",
        },
        button2: {
          x: centerX - buttonWidth - distanceBetweenButtons / 2,
          y: distanceBetweenHeaderText,
          text: "NORMAL",
        },
        button3: {
          x: centerX + distanceBetweenButtons / 2,
          y: distanceBetweenHeaderText,
          text: "HARD", 
        },
        button4: {
          x: centerX + buttonWidth + distanceBetweenButtons * 3 / 2 , 
          y: distanceBetweenHeaderText,
          text: "EXTREME",
        },
      };
    }

    const {
      button1: btn1,
      button2: btn2,
      button3: btn3,
      button4: btn4,
    } = buttons;

    const buttonsArray = [
      new Btn(
        btn1.x,
        btn1.y,
        buttonWidth,
        buttonHeight,
        btn1.text,
        buttonsShared.backgroundColor,
        buttonsShared.textColor,
        20, 
        15,
        buttonsShared.font,
        this.canvas
      ),
      new Btn(
        btn2.x,
        btn2.y,
        buttonWidth,
        buttonHeight,
        btn2.text,
        buttonsShared.backgroundColor,
        buttonsShared.textColor,
        20,
        15,
        buttonsShared.font,
        this.canvas
      ),
      new Btn(
        btn3.x,
        btn3.y,
        buttonWidth,
        buttonHeight,
        btn3.text,
        buttonsShared.backgroundColor,
        buttonsShared.textColor,
        20,
        15,
        buttonsShared.font,
        this.canvas
      ),
      new Btn(
        btn4.x,
        btn4.y,
        buttonWidth,
        buttonHeight,
        btn4.text,
        buttonsShared.backgroundColor,
        buttonsShared.textColor,
        20,
        15,
        buttonsShared.font,
        this.canvas
      ),
    ];

    if (screen === "menu") {
      this.playerSelectionButtonsArray = buttonsArray;

      this.playerSelectionButtonsArray.forEach((btn) => {
        btn.draw();
      });
    } else {
      this.difficultyButtonsArray = buttonsArray; 

      this.difficultyButtonsArray.forEach((btn) => {
        btn.draw();
      });
    }
  }
}
