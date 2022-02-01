//sobre a cobra
import { onMouseDown, onKeyDown } from '../input.js'

import { Level, level, drawLevel } from '../board.js'
import { addApple } from '../food.js'

export const cobraRapida = 3;

// Canvas e contexto
var canvas = document.getElementById("viewport"); 
export var context = canvas.getContext("2d");

// Frame por segundo
var lastframe = 0;

var initialized = false;

// Variaveis de imagem
var images = [];
export var tileimage;

// Varaiveis globais de imagem
var loadcount = 0;
var loadtotal = 0;
var preloaded = false;

// Load images
function loadImages(imagefiles) {
    loadcount = 0;
    loadtotal = imagefiles.length;
    preloaded = false;
    
    var loadedimages = [];
    for (var i=0; i<imagefiles.length; i++) {
        var image = new Image();
        
        image.onload = function () {
            loadcount++;
            if (loadcount == loadtotal) {
                preloaded = true;
            }
        };
        
        image.src = imagefiles[i];
        
        loadedimages[i] = image;
    }
    
    return loadedimages;
}

// Cobra
var Snake = function() {
    this.init(0, 0, 1, 10, 1);
}

// Tabela de direção: Up, Right, Down, Left
Snake.prototype.directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

// Inicializar a cobra em certo lugar
Snake.prototype.init = function(x, y, direction, speed, numsegments) {
    this.x = x;
    this.y = y;
    this.direction = direction; // Up, Right, Down, Left
    this.speed = speed;         // M,ovimentando por segundo
    this.movedelay = 0;
    
    this.segments = [];
    this.growsegments = 0;
    for (var i=0; i<numsegments; i++) {
        this.segments.push({x:this.x - i*this.directions[direction][0],
                            y:this.y - i*this.directions[direction][1]});
    }
}

Snake.prototype.grow = function() {
    this.growsegments++;
};

// Verifica se pode mover
Snake.prototype.tryMove = function(dt) {
    this.movedelay += dt;
    var maxmovedelay = 1 / this.speed;
    if (this.movedelay > maxmovedelay) {
        return true;
    }
    return false;
};

// Pega  posição do proximo movimento
Snake.prototype.nextMove = function() {
    var nextx = this.x + this.directions[this.direction][0];
    var nexty = this.y + this.directions[this.direction][1];
    return {x:nextx, y:nexty};
}

// Move a cobra
Snake.prototype.move = function() {

    var nextmove = this.nextMove();
    this.x = nextmove.x;
    this.y = nextmove.y;

    var lastseg = this.segments[this.segments.length-1];
    var growx = lastseg.x;
    var growy = lastseg.y;

    for (var i=this.segments.length-1; i>=1; i--) {
        this.segments[i].x = this.segments[i-1].x;
        this.segments[i].y = this.segments[i-1].y;
    }
    
    if (this.growsegments > 0) {
        this.segments.push({x:growx, y:growy});
        this.growsegments--;
    }
    
    this.segments[0].x = this.x;
    this.segments[0].y = this.y;
    
    this.movedelay = 0;
}

// Criando os objetos do jogo
export var snake = new Snake();


// Variaveis
var score = 0;              // Pontos
export var gameover = true;        // Fim de Jogo
export var gameovertime = 1;       // O tempo que o jogo acabou
export var gameoverdelay = 0.5;    // Tempo de espera após gameover

// Inicia o Jogo
export function init() {
    // Inicia as imagens (Cobra e maça)
    images = loadImages(["./snake-graphics.png"]);
    tileimage = images[0];

    // Adiciona o evento para iniciar o jogo com o mouse
    canvas.addEventListener("mousedown", onMouseDown);
    
    // Adiciona o evento dos botões
    document.addEventListener("keydown", onKeyDown);
    
    // starta o jogo
    newGame();
    gameover = true;

    // Entra no loop da main
    main(0);
}

export function newGame() {
    // Inicializa a cobra
    snake.init(10, 10, 1, 10, 4);
    
    // Gera o level padrão
    level.generate();
    
    // Adiciona maça
    addApple();
    
    // Initialize o score
    score = 0;
    
    // Inicializa a variavel
    gameover = false;
}



function main(tframe) {
    window.requestAnimationFrame(main);
    
    if (!initialized) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    
        if (preloaded) {
            initialized = true;
        }
    } else {
        update(tframe);
        render();
    }
}

// Update the game state
function update(tframe) {
    var dt = (tframe - lastframe) / 1000;
    lastframe = tframe;

    if (!gameover) {
        updateGame(dt);
    } else {
        gameovertime += dt;
    }
}

function updateGame(dt) {
    //move a cobra
    if (snake.tryMove(dt)) {
        // ve se teve alguma baida
        
       
        var nextmove = snake.nextMove();
        var nx = nextmove.x;
        var ny = nextmove.y;
        
        if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {
            if (level.tiles[nx][ny] == 1) {
          
                gameover = true;
            }
            
           
            for (var i=0; i<snake.segments.length; i++) {
                var sx = snake.segments[i].x;
                var sy = snake.segments[i].y;
                
                if (nx == sx && ny == sy) {
                    // Found a snake part
                    gameover = true;
                    break;
                }
            }
            
            if (!gameover) {
           

                snake.move();
                
                // verificar
                if (level.tiles[nx][ny] == 2) {
                 
                    level.tiles[nx][ny] = 0;
                    
              
                    addApple();
                    
        
                    snake.grow();
                    
                   
                    score++;
                }
                

            }
        } else {
            // Out of bounds
            gameover = true;
        }
        
        if (gameover) {
            gameovertime = 0;
        }
    }
}



// Renderiza o jogo
function render() {
    // Desenha o fundo
    context.fillStyle = "#577ddb";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    drawLevel();
    drawSnake();
        
    // Fim de Jogo
    if (gameover) {
        context.fillStyle = "rgba(0, 0, 1, 0.6)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = "#fff";
        context.font = "24px Verdana";
        drawCenterText("Start" , 0, canvas.height/2, canvas.width);
    }
}


// desenha a cobra
function drawSnake() {
    // Loop 
    for (var i=0; i<snake.segments.length; i++) {
        var segment = snake.segments[i];
        var segx = segment.x;
        var segy = segment.y;
        var tilex = segx*level.tilewidth;
        var tiley = segy*level.tileheight;
        
        var tx = 0;
        var ty = 0;
        
        if (i == 0) {
            // Cabeça
            var nseg = snake.segments[i+1];
            if (segy < nseg.y) {
                // Cima
                tx = 3; ty = 0;
            } else if (segx > nseg.x) {
                // Direita
                tx = 4; ty = 0;
            } else if (segy > nseg.y) {
                // Baixo
                tx = 4; ty = 1;
            } else if (segx < nseg.x) {
                // Esquerda
                tx = 3; ty = 1;
            }
        } else if (i == snake.segments.length-1) {
            // Rabo
            var pseg = snake.segments[i-1]; // 
            if (pseg.y < segy) {
                // Cima
                tx = 3; ty = 2;
            } else if (pseg.x > segx) {
                // Direita
                tx = 4; ty = 2;
            } else if (pseg.y > segy) {
                // Baixo
                tx = 4; ty = 3;
            } else if (pseg.x < segx) {
                // Esquerda
                tx = 3; ty = 3;
            }
        } else {
            // Body
            var pseg = snake.segments[i-1];
            var nseg = snake.segments[i+1];
            if (pseg.x < segx && nseg.x > segx || nseg.x < segx && pseg.x > segx) {
                // Horizontal esquerda-dirita
                tx = 1; ty = 0;
            } else if (pseg.x < segx && nseg.y > segy || nseg.x < segx && pseg.y > segy) {
                // cima Esquerda-baixo
                tx = 2; ty = 0;
            } else if (pseg.y < segy && nseg.y > segy || nseg.y < segy && pseg.y > segy) {
                // Angulo baixo-cima
                tx = 2; ty = 1;
            } else if (pseg.y < segy && nseg.x < segx || nseg.y < segy && pseg.x < segx) {
                // Angulo cima-esquerda
                tx = 2; ty = 2;
            } else if (pseg.x > segx && nseg.y < segy || nseg.x > segx && pseg.y < segy) {
                // Angulo cima-direita
                tx = 0; ty = 1;
            } else if (pseg.y > segy && nseg.x > segx || nseg.y > segy && pseg.x > segx) {
                // Angulo baixo-direita
                tx = 0; ty = 0;
            }
        }
        
        // Desenhar a conra pelos calculos
        context.drawImage(tileimage, tx*64, ty*64, 64, 64, tilex, tiley,
                          level.tilewidth, level.tileheight);
    }
}

function drawCenterText(text, x, y, width) {
    var textdim = context.measureText(text);
    context.fillText(text, x + (width-textdim.width)/2, y);
}