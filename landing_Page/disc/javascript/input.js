import { snake, gameover, gameoverdelay, gameovertime, newGame } from './cobra/snake.js'

export function onMouseDown(e) {
  if (gameover) {
      tryNewGame();
  }
}

// Esse metodo verifica o botão apertado e direciona a cobrinha
export function onKeyDown(e) {
  if (gameover) {
      tryNewGame();
  } else {
      if (e.keyCode == 37 || e.keyCode == 65) {
          if (snake.direction != 1)  {
              snake.direction = 3;
          }
      } else if (e.keyCode == 38 || e.keyCode == 87) {
          if (snake.direction != 2)  {
              snake.direction = 0;
          }
      } else if (e.keyCode == 39 || e.keyCode == 68) {
          if (snake.direction != 3)  {
              snake.direction = 1;
          }
      } else if (e.keyCode == 40 || e.keyCode == 83) {
          if (snake.direction != 0)  {
              snake.direction = 2;
          }
      }
      
      if (e.keyCode == 32) {
          snake.grow();
      }
  }
}

// Verifica se pode inicar um novo jogo
function tryNewGame() {
  if (gameovertime > gameoverdelay) {
      newGame();
      gameover = false;
  }
}