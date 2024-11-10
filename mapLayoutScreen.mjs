// game/mapLayoutScreen.mjs

import { GAME_BOARD_DIM, SHIP_SIZES } from "../consts.mjs";
import { print, clearScreen, printCentered } from "../utils/io.mjs";
import { create2DArrayWithFill } from "../utils/array.mjs";
import { KeyBoardManager } from "../utils/io.mjs";
import { t } from "../utils/language.mjs";
import { ANSI } from "../utils/ansi.mjs";

function createMapLayoutScreen() {
    let board = create2DArrayWithFill(GAME_BOARD_DIM, null);
    let shipsToPlace = [];
    let currentShipSize = null;
    let cursor = { x: 0, y: 0 };
    let orientation = 'horizontal';
    let isPlacing = true;
    let callback = null;
    let isDrawn = false;
    let lastOutputLength = 0;

    function canPlaceShip(x, y, size, orientation) {
        if (orientation === 'horizontal') {
            if (x + size > GAME_BOARD_DIM) return false;
            for (let i = 0; i < size; i++) {
                if (board[y][x + i] !== null) return false;
            }
        } else {
            if (y + size > GAME_BOARD_DIM) return false;
            for (let i = 0; i < size; i++) {
                if (board[y + i][x] !== null) return false;
            }
        }
        return true;
    }

    function placeShip(x, y, size, orientation) {
        if (orientation === 'horizontal') {
            for (let i = 0; i < size; i++) {
                board[y][x + i] = 'S';
            }
        } else {
            for (let i = 0; i < size; i++) {
                board[y + i][x] = 'S';
            }
        }
    }

    function isCursorOverShipArea(x, y) {
        if (orientation === 'horizontal') {
            let startX = cursor.x;
            let endX = cursor.x + currentShipSize - 1;
            if (startX <= x && x <= endX && y === cursor.y) {
                return true;
            }
        } else {
            let startY = cursor.y;
            let endY = cursor.y + currentShipSize - 1;
            if (startY <= y && y <= endY && x === cursor.x) {
                return true;
            }
        }
        return false;
    }

    function drawBoard() {
        clearScreen();
        let outputLines = [];
        outputLines.push(`${t('shipPlacementPhase')}\n`);

        let header = '   ' + [...Array(GAME_BOARD_DIM).keys()].map(i => String.fromCharCode(65 + i)).join('  ');
        outputLines.push(header);

        for (let y = 0; y < GAME_BOARD_DIM; y++) {
            let rowStr = `${(y + 1).toString().padStart(2, ' ')} `;
            for (let x = 0; x < GAME_BOARD_DIM; x++) {
                let cell = board[y][x];
                let displayChar = '';
                if (cell === 'S') {
                    displayChar = ANSI.COLOR.GREEN + 'S' + ANSI.RESET;
                } else {
                    displayChar = '~';
                }

                if (isCursorOverShipArea(x, y)) {
                    displayChar = ANSI.INVERSE + displayChar + ANSI.RESET;
                }

                rowStr += ` ${displayChar}`;
            }
            outputLines.push(rowStr);
        }

        outputLines.push(`\n${t('shipsToPlace')}: ${currentShipSize} ${t('spaces')}`);
        outputLines.push(`${t('controls')}:`);
        outputLines.push(`- ${t('arrowKeys')}: ${t('moveCursor')}`);
        outputLines.push(`- R: ${t('rotateShip')}`);
        outputLines.push(`- Enter: ${t('placeShip')}`);

        let output = outputLines.join('\n');
        printCenteredFixed(output);
    }

    function printCenteredFixed(text) {
        let lines = text.split('\n');
        let maxLength = Math.max(...lines.map(line => line.replace(/\x1b\[[0-9;]*m/g, '').length));

        if (lastOutputLength > maxLength) {
            maxLength = lastOutputLength;
        } else {
            lastOutputLength = maxLength;
        }

        let paddedLines = lines.map(line => {
            let lineLength = line.replace(/\x1b\[[0-9;]*m/g, '').length;
            let padding = ' '.repeat(Math.floor((maxLength - lineLength) / 2));
            return padding + line;
        });

        let paddedText = paddedLines.join('\n');
        clearScreen();
        print(paddedText);
    }

    function updatePlacement() {
        let moved = false;
        if (KeyBoardManager.isUpPressed()) {
            cursor.y = (cursor.y - 1 + GAME_BOARD_DIM) % GAME_BOARD_DIM;
            moved = true;
        } else if (KeyBoardManager.isDownPressed()) {
            cursor.y = (cursor.y + 1) % GAME_BOARD_DIM;
            moved = true;
        } else if (KeyBoardManager.isLeftPressed()) {
            cursor.x = (cursor.x - 1 + GAME_BOARD_DIM) % GAME_BOARD_DIM;
            moved = true;
        } else if (KeyBoardManager.isRightPressed()) {
            cursor.x = (cursor.x + 1) % GAME_BOARD_DIM;
            moved = true;
        } else if (KeyBoardManager.isRotatePressed()) {
            orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
            moved = true;
        } else if (KeyBoardManager.isEnterPressed()) {
            if (canPlaceShip(cursor.x, cursor.y, currentShipSize, orientation)) {
                placeShip(cursor.x, cursor.y, currentShipSize, orientation);
                if (shipsToPlace.length > 0) {
                    currentShipSize = shipsToPlace.shift();
                } else {
                    isPlacing = false;
                    if (callback) callback(board);
                }
                isDrawn = false;
            } else {
                isDrawn = false;
            }
        }

        if (moved) {
            isDrawn = false;
        }
    }

    return {
        name: 'MapLayoutScreen',
        update: function (dt) {
            if (isPlacing) {
                updatePlacement();
                if (!isDrawn) {
                    drawBoard();
                    isDrawn = true;
                }
            }
        },

        draw: function () {
            // Drawing is handled in update
        },

        init: function (player, cb) {
            board = create2DArrayWithFill(GAME_BOARD_DIM, null);
            shipsToPlace = [...SHIP_SIZES];
            currentShipSize = shipsToPlace.shift();
            cursor = { x: 0, y: 0 };
            orientation = 'horizontal';
            isPlacing = true;
            callback = cb;
            isDrawn = false;
            lastOutputLength = 0;
        }
    };
}

export default createMapLayoutScreen;