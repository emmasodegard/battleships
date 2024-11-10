// utils/displayBoard.mjs

import { GAME_BOARD_DIM } from "./consts.mjs";
import { print } from "./utils/io.mjs";
import { ANSI } from "./utils/ansi.mjs";

function displayBoard(board) {
    // Header: Three spaces for row numbers alignment, then letters A-J with single spaces
    let header = '   ' + [...Array(GAME_BOARD_DIM).keys()].map(i => String.fromCharCode(65 + i)).join(' ');
    print(header + '\n');
    
    for (let i = 0; i < GAME_BOARD_DIM; i++) {
        // Row number, padded to 2 characters, followed by a space
        let rowStr = `${(i + 1).toString().padStart(2, ' ')} `;
        
        for (let j = 0; j < GAME_BOARD_DIM; j++) {
            let cell = board.target[i][j];
            let displayChar = '';
            
            if (cell === null) {
                displayChar = '~'; // Empty water
            } else if (cell === 'X') {
                displayChar = ANSI.COLOR.RED + 'X' + ANSI.RESET; // Hit
            } else if (cell === 'O') {
                displayChar = ANSI.COLOR.YELLOW + 'O' + ANSI.RESET; // Miss
            } else {
                displayChar = cell; // Other cases, if any
            }
            
            rowStr += displayChar + ' '; // Add a space after each cell for alignment
        }
        
        print(rowStr + '\n');
    }
}

export { displayBoard };