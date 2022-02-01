//comida que a cobra vai comer 
 import { snake } from './cobra/snake.js'
 import { level } from './board.js'

// Adiciona a maça para algum lugar vazio e aleatorio
 export function addApple() {
    var valid = false;
    while (!valid) {
        // Posião randomica
        var ax = randRange(0, level.columns-1);
        var ay = randRange(0, level.rows-1);
        
        // Para ter certeza que a cobra não sobreponha a maça
        var overlap = false;
        for (var i=0; i<snake.segments.length; i++) {
            // PEga a posição da cobra
            var sx = snake.segments[i].x;
            var sy = snake.segments[i].y;
            
            // Verifica se esta sobreponto
            if (ax == sx && ay == sy) {
                overlap = true;
                break;
            }
        }
        
     
        if (!overlap && level.tiles[ax][ay] == 0) {
      
            level.tiles[ax][ay] = 2;
            valid = true;
        }
    }
}
    
 
function randRange(low, high) {
    return Math.floor(low + Math.random()*(high-low+1));
}