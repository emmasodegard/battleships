// battleShipsScreen.mjs

import { GAME_BOARD_DIM, FIRST_PLAYER, SECOND_PLAYER } from "../consts.mjs";
import { print, clearScreen } from "../utils/io.mjs";
import KeyBoardManager from "../utils/io.mjs";
import { ANSI } from "../utils/ansi.mjs";
import { create2DArrayWithFill } from "../utils/array.mjs";
import createGameOverScreen from "./gameOverScreen.mjs";
import languages from "../languages.mjs";

function createBattleshipScreen(firstPBoard, secondPBoard, language) {
    let currentPlayer = FIRST_PLAYER;
    let firstPlayerBoard = {
        ships: firstPBoard,
        targets: create2DArrayWithFill(GAME_BOARD_DIM, GAME_BOARD_DIM, 0)
    };
    let secondPlayerBoard = {
        ships: secondPBoard,
        targets: create2DArrayWithFill(GAME_BOARD_DIM, GAME_BOARD_DIM, 0)
    };
    let cursorColumn = 0;
    let cursorRow = 0;
    let isDrawn = false;
    let gameOver = false;
    let message = "";
    let shotProcessed = false;

    function swapPlayer() {
        currentPlayer *= -1;
        cursorColumn = 0;
        cursorRow = 0;
        isDrawn = false;
    }

    function checkGameOver(opponentBoard) {
        for (let row = 0; row < GAME_BOARD_DIM; row++) {
            for (let col = 0; col < GAME_BOARD_DIM; col++) {
                let shipCell = opponentBoard.ships[row][col];
                if (shipCell !== 0) {
                    let targetCell = opponentBoard.targets[row][col];
                    if (targetCell !== 'O') {
                        // This ship part has not been hit yet
                        return false;
                    }
                }
            }
        }
        return true;
    }

    return {
        isDrawn: false,
        next: null,
        transitionTo: null,

        init: function () { },

        update: function (dt) {
            if (gameOver) {
                // Since currentPlayer has not been swapped yet, the opponent is the winner
                let winnerPlayer = currentPlayer === FIRST_PLAYER ? '2' : '1';
                let gameOverScreen = createGameOverScreen(winnerPlayer, language);
                this.next = gameOverScreen;
                this.transitionTo = "Game Over Screen";
                return;
            }

            if (shotProcessed) {
                // Wait for player to acknowledge the shot result
                if (KeyBoardManager.isEnterPressed()) {
                    shotProcessed = false;
                    message = ""; // Clear the message after acknowledgment
                    if (!gameOver) {
                        swapPlayer();
                    }
                    this.isDrawn = false;
                }
                return;
            }

            // Handle movement inputs
            if (KeyBoardManager.isUpPressed()) {
                cursorRow = Math.max(0, cursorRow - 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isDownPressed()) {
                cursorRow = Math.min(GAME_BOARD_DIM - 1, cursorRow + 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isLeftPressed()) {
                cursorColumn = Math.max(0, cursorColumn - 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isRightPressed()) {
                cursorColumn = Math.min(GAME_BOARD_DIM - 1, cursorColumn + 1);
                this.isDrawn = false;
            }

            if (KeyBoardManager.isEnterPressed()) {
                let opponentBoard = currentPlayer === FIRST_PLAYER ? secondPlayerBoard : firstPlayerBoard;
                let targetCell = opponentBoard.targets[cursorRow][cursorColumn];
                if (targetCell === 0) {
                    let shipCell = opponentBoard.ships[cursorRow][cursorColumn];
                    console.log(`Shot fired at (${cursorRow}, ${cursorColumn}), shipCell: ${shipCell}`); // Debug statement

                    if (shipCell !== 0) {
                        // It's a hit
                        opponentBoard.targets[cursorRow][cursorColumn] = 'O';
                        message = languages[language].hit;
                    } else {
                        // It's a miss
                        opponentBoard.targets[cursorRow][cursorColumn] = 'X';
                        message = languages[language].miss;
                    }

                    if (checkGameOver(opponentBoard)) {
                        gameOver = true;
                    }

                    shotProcessed = true; // Indicate that a shot has been made
                    this.isDrawn = false;
                } else {
                    message = languages[language].already_fired;
                    this.isDrawn = false;
                }
            }
        },

        draw: function (dr) {
            if (this.isDrawn) return;
            this.isDrawn = true;
            clearScreen();

            let opponentBoard = currentPlayer === FIRST_PLAYER ? secondPlayerBoard : firstPlayerBoard;
            let targets = opponentBoard.targets;

            let output = `${ANSI.TEXT.BOLD}${ANSI.COLOR.YELLOW}${languages[language].player_turn.replace('{player}', currentPlayer === FIRST_PLAYER ? '1' : '2')}\n\n${ANSI.TEXT.BOLD_OFF}${ANSI.RESET}`;
            output += '  ';
            for (let i = 0; i < GAME_BOARD_DIM; i++) {
                output += ` ${String.fromCharCode(65 + i)}`;
            }
            output += '\n';

            for (let y = 0; y < GAME_BOARD_DIM; y++) {
                output += `${String(y + 1).padStart(2, ' ')} `;
                for (let x = 0; x < GAME_BOARD_DIM; x++) {
                    let cell = targets[y][x];
                    let displayChar = ' ';
                    if (cell === 'O') {
                        displayChar = ANSI.COLOR.RED + 'O' + ANSI.RESET;
                    } else if (cell === 'X') {
                        displayChar = ANSI.COLOR.BLUE + 'X' + ANSI.RESET;
                    } else if (x === cursorColumn && y === cursorRow && !shotProcessed) {
                        displayChar = ANSI.COLOR.GREEN + '█' + ANSI.RESET;
                    } else {
                        displayChar = ' ';
                    }
                    output += displayChar + ' ';
                }
                output += `${y + 1}\n`;
            }

            output += '  ';
            for (let i = 0; i < GAME_BOARD_DIM; i++) {
                output += ` ${String.fromCharCode(65 + i)}`;
            }
            output += '\n\n';

            if (shotProcessed) {
                output += `${message}\n`;
                output += `\n${languages[language].press_enter_to_continue}\n`;
            } else {
                output += `${ANSI.TEXT.BOLD}${ANSI.COLOR.YELLOW}${languages[language].controls}${ANSI.TEXT.BOLD_OFF}${ANSI.RESET}\n`;
                output += `${languages[language].arrow_keys}\n`;
                output += `${languages[language].enter_fire}\n`;
                if (message) {
                    output += `\n${message}\n`;
                    message = ""; // Clear the message after displaying
                }
            }

            print(output);
        }
    }
}

export default createBattleshipScreen;
