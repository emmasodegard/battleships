// gameBoard.mjs

import { create2DArrayWithFill } from "../utils/array.mjs";
import { GAME_BOARD_DIM } from "../consts.mjs";

function createGameBoard() {
    return {
        ships: create2DArrayWithFill(GAME_BOARD_DIM, null),
        target: create2DArrayWithFill(GAME_BOARD_DIM, null)
    };
}

function placeShip(board, ship, startRow, startCol, orientation) {
    const size = ship.size;
    // Validate placement
    if (orientation === 'H') {
        if (startCol + size > GAME_BOARD_DIM) return false;
        for (let i = 0; i < size; i++) {
            if (board.ships[startRow][startCol + i] !== null) return false;
        }
        for (let i = 0; i < size; i++) {
            board.ships[startRow][startCol + i] = 'S';
        }
    } else if (orientation === 'V') {
        if (startRow + size > GAME_BOARD_DIM) return false;
        for (let i = 0; i < size; i++) {
            if (board.ships[startRow + i][startCol] !== null) return false;
        }
        for (let i = 0; i < size; i++) {
            board.ships[startRow + i][startCol] = 'S';
        }
    } else {
        return false;
    }
    return true;
}

export { createGameBoard, placeShip };
