import { print, clearScreen, printCentered } from "./utils/io.mjs";
import { KeyBoardManager } from "./utils/io.mjs";
import { t, setLanguage } from "./utils/language.mjs";

function createLanguageSelectionScreen() {
    let currentActiveMenuItem = 0;
    const menuItems = [
        { text: t('english'), value: 'en' },
        { text: t('norwegian'), value: 'no' }
    ];
    const menuItemCount = menuItems.length;
    let isDrawn = false;

    return {
        name: 'LanguageSelectionScreen',
        next: null,
        transitionTo: null,

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
                setLanguage(menuItems[currentActiveMenuItem].value);
                this.transitionTo = this.next;
            }

            if (hasChanged) {
                this.isDrawn = false;
            }
        },

        draw: function () {
            if (!this.isDrawn) {
                this.isDrawn = true;
                clearScreen();
                let output = `${t('selectLanguage')}\n\n`;

                menuItems.forEach((menuItem, index) => {
                    const indicator = index === currentActiveMenuItem ? '> ' : '  ';
                    output += `${indicator}${menuItem.text}\n`;
                });

                printCentered(output);
            }
        }
    };
}

export default createLanguageSelectionScreen;