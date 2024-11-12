import { print, clearScreen, printCenterd } from "../utils/io.mjs";
import { ANSI } from "../utils/ansi.mjs";
import languages from "../languages.mjs";

const UI_LINES = [
    " ######                                    #####                         ",
    " #     #   ##   ##### ##### #      ###### #     # #    # # #####   ####  ",
    " #     #  #  #    #     #   #      #      #       #    # # #    # #      ",
    " ######  #    #   #     #   #      #####   #####  ###### # #    #  ####  ",
    " #     # ######   #     #   #      #            # #    # # #####       # ",
    " #     # #    #   #     #   #      #      #     # #    # # #      #    # ",
    " ######  #    #   #     #   ###### ######  #####  #    # # #       ####  ",
    "                                                                         "
];
let isDrawn = false;
let countdown = 2500;

const colors = [ANSI.COLOR.RED, ANSI.COLOR.YELLOW, ANSI.COLOR.GREEN, ANSI.COLOR.BLUE];

const SplashScreen = {
    next: null,
    transitionTo: null,

    update: function (dt) {
        countdown -= dt;
        if (countdown <= 0) {
            this.transitionTo = this.next;
        }
    },

    draw: function (dt) {
        if (!isDrawn) {
            isDrawn = true;
            clearScreen();
            let output = '';
            for (let i = 0; i < UI_LINES.length; i++) {
                let colorIndex = Math.floor((i / UI_LINES.length) * colors.length);
                output += colors[colorIndex] + UI_LINES[i] + ANSI.RESET + '\n';
            }
            printCenterd(output);
        }
    }
}

export default SplashScreen;
