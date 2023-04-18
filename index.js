import Game from "./Game/Game"; 

const canvas= document.querySelector("#canvas"); 

const game = new Game(canvas); 
/* */ 
window.onload= () => game.init(); 
