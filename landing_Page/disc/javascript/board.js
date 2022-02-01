import {context, tileimage} from './cobra/snake.js'
// Propriedades do level


export var Level = function (columns, rows, tilewidth, tileheight) {
    this.columns = columns;
    this.rows = rows;
    this.tilewidth = tilewidth;
    this.tileheight = tileheight;
    

    this.tiles = [];
    for (var i=0; i<this.columns; i++) {
        this.tiles[i] = [];
        for (var j=0; j<this.rows; j++) {
            this.tiles[i][j] = 0;
        }
    }
};

export var level = new Level(20, 15, 32, 32);
// Gera o fundo do jogo padrão
Level.prototype.generate = function() {
    for (var i=0; i<this.columns; i++) {
        for (var j=0; j<this.rows; j++) {
            if (i == 0 || i == this.columns-1 ||
                j == 0 || j == this.rows-1) {
                // Add walls at the edges of the level
                this.tiles[i][j] = 1;
            } else {
                // Add empty space
                this.tiles[i][j] = 0;
            }
        }
    }
};

// Desenha o fundo
export function drawLevel() {
    for (var i=0; i<level.columns; i++) {
        for (var j=0; j<level.rows; j++) {
            // Get the current tile and location
            var tile = level.tiles[i][j];
            var tilex = i*level.tilewidth;
            var tiley = j*level.tileheight;
            
            if (tile == 0) {
                // Espaço em branco
                context.fillStyle = "#e1bdef";
                context.fillRect(tilex, tiley, level.tilewidth, level.tileheight);
            } else if (tile == 1) {
                // Parede
                context.fillStyle = "#6a5acd";
                context.fillRect(tilex, tiley, level.tilewidth, level.tileheight);
            } else if (tile == 2) {
                // Maça
                
                // Desenha o fundo da maça
                context.fillStyle = "#e1bdef";
                context.fillRect(tilex, tiley, level.tilewidth, level.tileheight);
                
                // Desenha a Maça
                var tx = 0;
                var ty = 3;
                var tilew = 64;
                var tileh = 64;
                context.drawImage(tileimage, tx*tilew, ty*tileh, tilew, tileh, tilex, tiley, level.tilewidth, level.tileheight);
            }
        }
    }
}


