import { GAME_BOARD_DIM, FIRST_PLAYER, SECOND_PLAYER } from "../consts.mjs";
import { print, clearScreen, printCentered } from "../utils/io.mjs";
import { t } from "../utils/language.mjs";
import { create2DArrayWithFill } from "../utils/array.mjs";
import { ANSI } from "../utils/ansi.mjs";
import { KeyBoardManager } from "../utils/io.mjs";
import createGameOverScreen from "../gameOverScreen.mjs";
import { displayBoard } from "../displayBoard.mjs";

function createBattleshipScreen(nextState) {
    return {
        name: 'BattleshipScreen',
        transitionTo: null,

        currentPlayer: FIRST_PLAYER,
        player1Board: null,
        player2Board: null,
        currentBoard: null,
        opponentBoard: null,
        gameOver: false,
        awaitingInput: false,
        isDrawn: false,

        swapPlayer: function() {
            this.currentPlayer = (this.currentPlayer === FIRST_PLAYER) ? SECOND_PLAYER : FIRST_PLAYER;
            if (this.currentPlayer === FIRST_PLAYER) {
                this.currentBoard = this.player1Board;
                this.opponentBoard = this.player2Board;
            } else {
                this.currentBoard = this.player2Board;
                this.opponentBoard = this.player1Board;
            }
            this.isDrawn = false;
        },

        checkWinCondition: function(board) {
            for (let row of board.ships) {
                for (let cell of row) {
                    if (cell === 'S') {
                        return false;
                    }
                }
            }
            return true;
        },

        parseCoordinates: function(input) {
            input = input.toUpperCase();
            let colChar = input.charAt(0);
            let rowNum = parseInt(input.slice(1)) - 1;
            let colNum = colChar.charCodeAt(0) - 65;
            if (isNaN(rowNum) || colNum < 0 || colNum >= GAME_BOARD_DIM || rowNum < 0 || rowNum >= GAME_BOARD_DIM) {
                return null;
            }
            return { row: rowNum, col: colNum };
        },

        readLine: function(promptText, callback) {
            let input = '';
            print(promptText);

            function onKeyPress(str, key) {
                if (key.sequence === '\u0003') { // Ctrl+C
                    process.exit();
                } else if (key.name === 'return') {
                    process.stdin.removeListener('keypress', onKeyPress);
                    print('\n');
                    callback(input);
                } else if (key.name === 'backspace' || key.sequence === '\b' || key.sequence === '\x7f') {
                    if (input.length > 0) {
                        input = input.slice(0, -1);
                        print('\b \b');
                    }
                } else {
                    input += str;
                    print(str);
                }
            }

            process.stdin.on('keypress', onKeyPress);
        },

        promptForCoordinates: function() {
            this.readLine(`\n${t('enterCoordinates')}`, (input) => {
                const position = this.parseCoordinates(input);
                if (position) {
                    const { row, col } = position;
                    if (this.currentBoard.target[row][col] !== null) {
                        print(`\n${t('invalidCoordinates')}\n`);
                        this.promptForCoordinates();
                    } else {
                        if (this.opponentBoard.ships[row][col] === 'S') {
                            print(`\n${ANSI.COLOR.GREEN}${t('hit')}${ANSI.RESET}\n`);
                            this.opponentBoard.ships[row][col] = 'X';
                            this.currentBoard.target[row][col] = 'X';
                        } else {
                            print(`\n${ANSI.COLOR.RED}${t('miss')}${ANSI.RESET}\n`);
                            this.opponentBoard.ships[row][col] = 'O';
                            this.currentBoard.target[row][col] = 'O';
                        }

                        if (this.checkWinCondition(this.opponentBoard)) {
                            print(`\n${t('player')} ${this.currentPlayer === FIRST_PLAYER ? '1' : '2'} ${t('wins')}!\n`);
                            this.gameOver = true;
                            this.awaitingInput = false;

                            const gameOverScreen = createGameOverScreen(this.currentPlayer === FIRST_PLAYER ? '1' : '2');
                            gameOverScreen.next = nextState;
                            this.transitionTo = gameOverScreen;
                            return;
                        }

                        this.readLine(`\n${t('pressEnterToContinue')}`, () => {
                            this.swapPlayer();
                            this.awaitingInput = false;
                        });
                    }
                } else {
                    print(`\n${t('invalidCoordinates')}\n`);
                    this.promptForCoordinates();
                }
            });
        },

        update: function(dt) {
            if (this.gameOver) {
                return;
            }

            if (!this.awaitingInput) {
                if (!this.isDrawn) {
                    clearScreen();
                    let outputLines = [];
                    outputLines.push(`${t('player')} ${this.currentPlayer === FIRST_PLAYER ? '1' : '2'}'s Turn\n`);
                    displayBoard(this.currentBoard);
                    this.isDrawn = true;
                }

                this.awaitingInput = true;
                this.promptForCoordinates();
            }
        },

        draw: function(dt) {
            // Drawing is handled in update
        },

        init: function(player1ShipMap, player2ShipMap) {
            this.player1Board = {
                ships: player1ShipMap,
                target: create2DArrayWithFill(GAME_BOARD_DIM, null)
            };
            this.player2Board = {
                ships: player2ShipMap,
                target: create2DArrayWithFill(GAME_BOARD_DIM, null)
            };
            this.currentPlayer = FIRST_PLAYER;
            this.currentBoard = this.player1Board;
            this.opponentBoard = this.player2Board;
            this.gameOver = false;
            this.awaitingInput = false;
            this.isDrawn = false;
        }
    };
}
    export default createBattleshipScreen;