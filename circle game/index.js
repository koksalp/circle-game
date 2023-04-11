import Game from "./Game/Game.js"; 

const canvas= document.querySelector("#canvas"); 

const game = new Game(canvas); 
/* */ 
window.onload= () => game.init(); 