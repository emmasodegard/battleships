import { ANSI } from "../utils/ansi.mjs";
import KeyBoardManager, { clearScreen } from "../utils/io.mjs";
import { print, printCenterd } from "../utils/io.mjs";

function createMenu(menuItems, title = '') {
    let currentActiveMenuItem = 0;

    return {
        currentActiveMenuItem, // Expose this property
        isDrawn: false,
        next: null,
        transitionTo: null,

        update: function (dt) {
            if (KeyBoardManager.isUpPressed()) {
                currentActiveMenuItem--;
                if (currentActiveMenuItem < 0) {
                    currentActiveMenuItem = menuItems.length - 1; // Wrap around to the last item
                }
                this.isDrawn = false;
            }
            else if (KeyBoardManager.isDownPressed()) {
                currentActiveMenuItem++;
                if (currentActiveMenuItem >= menuItems.length) {
                    currentActiveMenuItem = 0; // Wrap around to the first item
                }
                this.isDrawn = false;
            }
            else if (KeyBoardManager.isEnterPressed()) {
                if (menuItems[currentActiveMenuItem].action) {
                    menuItems[currentActiveMenuItem].action();
                }
            }
        },

        draw: function () {
            if (this.isDrawn == false) {
                this.isDrawn = true;
                clearScreen();
                let output = "";

                if (title) {
                    output += `${title}\n`;
                }

                for (let index in menuItems) {
                    let menuItem = menuItems[index];

                    let titleText = menuItem.text;
                    if (currentActiveMenuItem == menuItem.id) {
                        titleText = `${ANSI.TEXT.BOLD}> ${menuItem.text}${ANSI.TEXT.BOLD_OFF}`;
                    } else {
                        titleText = `  ${menuItem.text}`;
                    }

                    output += titleText + "\n";
                }

                printCenterd(output);
            }
        }
    }
}

export default createMenu;
