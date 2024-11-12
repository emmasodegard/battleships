import { print, clearScreen, printCenterd } from "../utils/io.mjs";
import { ANSI } from "../utils/ansi.mjs";
import KeyBoardManager from "../utils/io.mjs";
import createMenu from "../utils/menu.mjs";
import languages from "../languages.mjs";
import { mainMenuScene, currentState } from "../game.mjs";

function createGameOverScreen(winnerPlayer, language) {
    let menuItemCount = 0;
    let menuItems = [
        {
            text: languages[language].play_again, id: menuItemCount++, action: function () {
                // Transition back to the main menu
                currentState.next = mainMenuScene;
                currentState.transitionTo = "Main Menu";
            }
        },
        {
            text: languages[language].menu.exit_game, id: menuItemCount++, action: function () {
                print(ANSI.SHOW_CURSOR);
                clearScreen();
                process.exit();
            }
        }
    ];

    // Create a title for the Game Over screen
    let title = `${ANSI.TEXT.BOLD}${ANSI.COLOR.YELLOW}${languages[language].game_over}\n\n${ANSI.TEXT.BOLD_OFF}${ANSI.RESET}`;
    title += `${languages[language].player_wins.replace('{player}', winnerPlayer)}\n\n`;

    let menu = createMenu(menuItems, title);

    return {
        isDrawn: false,
        next: null,
        transitionTo: null,

        update: function (dt) {
            menu.update(dt);
            if (menu.transitionTo != null) {
                this.next = menu.next;
                this.transitionTo = menu.transitionTo;
            }
            // Reset isDrawn to false if the menu needs to redraw
            if (!menu.isDrawn) {
                this.isDrawn = false;
            }
        },

        draw: function (dr) {
            if (!this.isDrawn) {
                this.isDrawn = true;
                menu.draw();
            }
        }
    }
}

export default createGameOverScreen;
