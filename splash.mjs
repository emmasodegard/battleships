// game/splash.mjs

import { clearScreen, printCentered } from "../utils/io.mjs";
import { ANSI } from "../utils/ansi.mjs";

const SplashScreen = {
    name: 'SplashScreen',
    next: null, // To be set externally (e.g., main menu)
    transitionTo: null,
    isDrawn: false,

    update: function (dt) {
        if (!this.isDrawn) {
            clearScreen();
            this.draw();
            this.isDrawn = true;
            setTimeout(() => {
                this.transitionTo = this.next;
            }, 3000); // Display splash screen for 3 seconds
        }
    },

    draw: function () {
        const splashLines = [
            '  ____        _   _   _           _     _         ',
            ' |  _ \\      | | | | | |         | |   (_)        ',
            ' | |_) | __ _| |_| |_| | ___  ___| |__  _ _ __    ',
            ' |  _ < / _` | __| __| |/ _ \\/ __| \'_ \\| | \'_ \\   ',
            ' | |_) | (_| | |_| |_| |  __/\\__ \\ | | | | |_) |  ',
            ' |____/ \\__,_|\\__|\\__|_|\\___||___/_| |_|_| .__/   ',
            '                                          | |     ',
            '                                          |_|     ',
        ];

        const colors = [
            ANSI.COLOR.RED,
            ANSI.COLOR.YELLOW,
            ANSI.COLOR.GREEN,
            ANSI.COLOR.BLUE
        ];

        let coloredText = '';
        const linesPerColor = Math.ceil(splashLines.length / colors.length);

        for (let i = 0; i < splashLines.length; i++) {
            const colorIndex = Math.floor(i / linesPerColor);
            const color = colors[colorIndex] || ANSI.RESET;
            coloredText += color + splashLines[i] + ANSI.RESET + '\n';
        }

        printCentered(coloredText);
    }
};

export default SplashScreen;
