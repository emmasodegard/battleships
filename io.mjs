// utils/io.mjs

import * as readline from "node:readline";
import { ANSI } from "./ansi.mjs";

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

const KEY_ID = {
    down: "down",
    up: "up",
    left: "left",
    right: "right",
    enter: "return",
    escape: "escape",
    r: "r",
    '1': '1',
    '2': '2'
};

const KEY_STATES = Object.keys(KEY_ID).reduce((prev, cur) => {
    prev[cur] = false;
    return prev;
}, {});

process.stdin.on("keypress", (str, key) => {
    if (key.sequence === '\u0003') { // Ctrl+C
        process.exit();
    }

    if (KEY_STATES.hasOwnProperty(key.name)) {
        KEY_STATES[key.name] = true;
    }
});

function readKeyState(key) {
    let value = KEY_STATES[key];
    KEY_STATES[key] = false;
    return value;
}

const KeyBoardManager = {
    isEnterPressed: () => {
        return readKeyState(KEY_ID.enter);
    },
    isDownPressed: () => {
        return readKeyState(KEY_ID.down);
    },
    isUpPressed: () => {
        return readKeyState(KEY_ID.up);
    },
    isLeftPressed: () => {
        return readKeyState(KEY_ID.left);
    },
    isRightPressed: () => {
        return readKeyState(KEY_ID.right);
    },
    isRotatePressed: () => {
        return readKeyState(KEY_ID.r);
    },
    isKeyPressed: (key) => {
        return readKeyState(key);
    }
};

function calculateStringBounds(str) {
    str = str ?? "";
    const lines = str.split("\n");
    let minLineLength = str.length;
    let maxLineLength = 0;
    let height = lines.length;

    for (const line of lines) {
        const length = line.length;
        if (length < minLineLength) {
            minLineLength = length;
        }
        if (length > maxLineLength) {
            maxLineLength = length;
        }
    }

    return { max: maxLineLength, min: minLineLength, height, width: maxLineLength };
}

function printLine(text) {
    process.stdout.write(`${text}\n\r`);
}

function print(...text) {
    process.stdout.write(`${text.join("")}`);
}

function printCentered(text) {
    const textBounds = calculateStringBounds(text);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const sr = Math.round((rows - textBounds.height) * 0.5);
    const sc = Math.round((columns - textBounds.width) * 0.5);
    printWithOffset(text, sr, sc);
}

function printWithOffset(text, row, col) {
    const lines = text.split("\n");
    let output = ANSI.moveCursorTo(row, 0);

    for (let line of lines) {
        output += ANSI.CURSOR_RIGHT.repeat(col) + line + '\n';
    }

    print(output);
}

function clearScreen() {
    print(ANSI.CLEAR_SCREEN, ANSI.DELETE_SCREEN, ANSI.CURSOR_HOME, ANSI.RESTORE_CURSOR);
}

function getConsoleSize() {
    const columns = process.stdout.columns || 80;
    const rows = process.stdout.rows || 24;
    return { columns, rows };
}

function checkConsoleSize(minWidth = 80, minHeight = 24) {
    const { columns, rows } = getConsoleSize();
    if (columns < minWidth || rows < minHeight) {
        clearScreen();
        print(`\nConsole size is too small (minimum ${minWidth}x${minHeight}). Please resize your window and press Enter to continue.\n`);
        process.stdin.once('data', () => {
            checkConsoleSize(minWidth, minHeight);
        });
    }
}

export { KeyBoardManager, print, printLine, printCentered, clearScreen, getConsoleSize, checkConsoleSize };
