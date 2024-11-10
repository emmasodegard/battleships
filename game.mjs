import { ANSI } from "./utils/ansi.mjs";
import { print, clearScreen, checkConsoleSize } from "./utils/io.mjs";
import SplashScreen from "./game/splash.mjs";
import { FIRST_PLAYER, SECOND_PLAYER } from "./consts.mjs";
import createMenu from "./utils/menu.mjs";
import createMapLayoutScreen from "./game/mapLayoutScreen.mjs";
import createInnBetweenScreen from "./game/innbetweenScreen.mjs";
import createBattleshipScreen from "./game/battleshipsScreen.mjs";
import { t } from "./utils/language.mjs";
import createLanguageSelectionScreen from "./languageSelectionScreen.mjs";
import createGameOverScreen from "./gameOverScreen.mjs"; // Ensure correct import path

const GAME_FPS = 1000 / 60;
let currentState = null;
let gameLoop = null;

function update() {
    if (currentState) {
        const stateName = currentState.name || 'Unknown State';
        console.log(`Current State: ${stateName}`);
        
        currentState.update(GAME_FPS);
        currentState.draw(GAME_FPS);
        
        if (currentState.transitionTo != null) {
            const nextStateName = currentState.transitionTo.name || 'Unknown State';
            console.log(`Transitioning to: ${nextStateName}`);
            currentState = currentState.transitionTo;
            currentState.transitionTo = null;
            print(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
        }
    }
}

(function initialize() {
    clearScreen();
    checkConsoleSize();
    print(ANSI.HIDE_CURSOR);
    clearScreen();

    const mainMenuScene = createMenu(buildMenu());
    const languageSelectionScene = createLanguageSelectionScreen();
    languageSelectionScene.next = mainMenuScene; // LanguageSelectionScreen transitions to MainMenuScene

    SplashScreen.next = languageSelectionScene; // SplashScreen transitions to LanguageSelectionScreen

    currentState = SplashScreen; // Initialize currentState to SplashScreen
    gameLoop = setInterval(update, GAME_FPS);
})();

// **Build the Main Menu**
function buildMenu() {
    let menuItemCount = 0;
    return [
        {
            text: t("startGame"),
            id: menuItemCount++,
            action: function () {
                clearScreen();

                const innbetween1 = createInnBetweenScreen();
                innbetween1.init('shipPlacementFirstPlayer', () => {
                    const p1map = createMapLayoutScreen();
                    p1map.init(FIRST_PLAYER, (player1ShipMap) => {
                        const innbetween2 = createInnBetweenScreen();
                        innbetween2.init('shipPlacementSecondPlayer', () => {
                            const p2map = createMapLayoutScreen();
                            p2map.init(SECOND_PLAYER, (player2ShipMap) => {
                                const battleshipScreen = createBattleshipScreen(mainMenuScene);
                                battleshipScreen.init(player1ShipMap, player2ShipMap);
                                p2map.transitionTo = battleshipScreen;
                            });
                            innbetween2.transitionTo = p2map;
                        });
                        innbetween1.transitionTo = innbetween2;
                    });
                    innbetween1.transitionTo = p1map;
                });
                this.transitionTo = innbetween1;
            }
        },
        {
            text: t("exitGame"),
            id: menuItemCount++,
            action: function () {
                print(ANSI.SHOW_CURSOR);
                clearScreen();
                process.exit();
            }
        },
    ];
}

export default gameLoop;