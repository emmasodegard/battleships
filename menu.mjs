import { print, clearScreen, printCentered } from "./io.mjs";
import { KeyBoardManager } from "./io.mjs";

function createMenu(menuItems) {
    let currentActiveMenuItem = 0;
    const menuItemCount = menuItems.length;

    return {
        name: 'Menu',
        transitionTo: null,
        isDrawn: false,

        update: function (dt) {
            let hasChanged = false;

            if (KeyBoardManager.isUpPressed()) {
                currentActiveMenuItem = (currentActiveMenuItem - 1 + menuItemCount) % menuItemCount;
                hasChanged = true;
            }
            if (KeyBoardManager.isDownPressed()) {
                currentActiveMenuItem = (currentActiveMenuItem + 1) % menuItemCount;
                hasChanged = true;
            }
            if (KeyBoardManager.isEnterPressed()) {
                menuItems[currentActiveMenuItem].action.call(this);
            }

            if (hasChanged) {
                this.isDrawn = false;
            }
        },

        draw: function () {
            if (!this.isDrawn) {
                this.isDrawn = true;
                clearScreen();
                let output = "";

                for (let [index, menuItem] of menuItems.entries()) {
                    let title = menuItem.text;
                    if (currentActiveMenuItem === index) {
                        title = `> ${menuItem.text}`;
                    } else {
                        title = `  ${menuItem.text}`;
                    }

                    output += title + "\n";
                }

                printCentered(output);
            }
        }
    };
}

export default createMenu;