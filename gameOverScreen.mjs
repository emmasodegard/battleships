import { clearScreen, printCentered } from "./utils/io.mjs";
import { ANSI } from "./utils/ansi.mjs";
import { t } from "./utils/language.mjs";
import { KeyBoardManager } from "./utils/io.mjs";

function createGameOverScreen(winningPlayer) {
    return {
        name: 'GameOverScreen',
        next: null,
        transitionTo: null,

        isDrawn: false,
        selectedOption: 0,
        options: [
            { text: t('restartGame'), action: 'RESTART' },
            { text: t('exitGame'), action: 'EXIT' }
        ],

        update: function(dt) {
            if (!this.isDrawn) {
                clearScreen();
                this.draw();
                this.isDrawn = true;
            }

            if (KeyBoardManager.isUpPressed()) {
                this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
                this.isDrawn = false;
            } else if (KeyBoardManager.isDownPressed()) {
                this.selectedOption = (this.selectedOption + 1) % this.options.length;
                this.isDrawn = false;
            } else if (KeyBoardManager.isEnterPressed()) {
                const action = this.options[this.selectedOption].action;
                if (action === 'RESTART') {
                    this.transitionTo = this.next;
                } else if (action === 'EXIT') {
                    print(ANSI.SHOW_CURSOR);
                    clearScreen();
                    process.exit();
                }
            }
        },

        draw: function() {
            let output = `${t('player')} ${winningPlayer} ${t('wins')}!\n\n`;
            output += `${t('selectOption')}\n\n`;
            this.options.forEach((option, index) => {
                let line = `${index === this.selectedOption ? '> ' : '  '}${option.text}`;
                output += line + '\n';
            });
            printCentered(output);
        },

        init: function() {
            // No initialization needed
        }
    };
}

export default createGameOverScreen;