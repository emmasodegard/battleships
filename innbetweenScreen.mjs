// game/innbetweenScreen.mjs

import { print, clearScreen } from "../utils/io.mjs";
import { KeyBoardManager } from "../utils/io.mjs";
import { t } from "../utils/language.mjs";

function createInnBetweenScreen() {
    let messageKey = '';
    let callback = null;
    let isDrawn = false;

    return {
        update: function (dt) {
            if (!isDrawn) {
                clearScreen();
                print(`${t(messageKey)}\n\n`);
                print(`${t('pressEnterToContinue')}`);
                isDrawn = true;
            }
            if (KeyBoardManager.isEnterPressed()) {
                if (callback) callback();
            }
        },

        draw: function () {
            // Drawing is handled in update
        },

        init: function (msgKey, cb) {
            messageKey = msgKey;
            callback = cb;
            isDrawn = false;
        }
    };
}

export default createInnBetweenScreen;
