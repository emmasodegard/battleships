// utils/ansi.mjs

export const ANSI = {
    CLEAR_SCREEN: '\x1b[2J',
    DELETE_SCREEN: '\x1b[3J',
    CURSOR_HOME: '\x1b[H',
    CURSOR_HIDE: '\x1b[?25l',
    CURSOR_SHOW: '\x1b[?25h',
    CURSOR_SAVE: '\x1b7',
    CURSOR_RESTORE: '\x1b8',
    CURSOR_UP: '\x1b[A',
    CURSOR_DOWN: '\x1b[B',
    CURSOR_FORWARD: '\x1b[C',
    CURSOR_BACKWARD: '\x1b[D',
    RESET: '\x1b[0m',
    INVERSE: '\x1b[7m',
    COLOR: {
        RESET: '\x1b[39m', // Reset to default color
        BLACK: '\x1b[30m',
        RED: '\x1b[31m',
        GREEN: '\x1b[32m',
        YELLOW: '\x1b[33m',
        BLUE: '\x1b[34m',
        MAGENTA: '\x1b[35m',
        CYAN: '\x1b[36m',
        WHITE: '\x1b[37m',
    },
    moveCursorTo: (row, col) => `\x1b[${row};${col}H`,
    CURSOR_RIGHT: '\x1b[C',
    HIDE_CURSOR: '\x1b[?25l',
    SHOW_CURSOR: '\x1b[?25h',
};

export default ANSI;
