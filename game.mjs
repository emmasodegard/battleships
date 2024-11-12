import { ANSI } from "./utils/ansi.mjs";
import { print, clearScreen } from "./utils/io.mjs";
import SplashScreen from "./game/splash.mjs";
import { FIRST_PLAYER, SECOND_PLAYER } from "./consts.mjs";
import createMenu from "./utils/menu.mjs";
import createMapLayoutScreen from "./game/mapLayoutScreen.mjs";
import createInnBetweenScreen from "./game/innbetweenScreen.mjs";
import createBattleshipScreen from "./game/battleShipsScreen.mjs";
import languages from "./languages.mjs";

let currentLanguage = 'en';
const MIN_COLUMNS = 80;
const MIN_ROWS = 24;

let MAIN_MENU_ITEMS;
let mainMenuScene;
let currentState = null;
let gameLoop = null;

const GAME_FPS = 1000 / 60;

(function initialize() {
    if (process.stdout.columns < MIN_COLUMNS || process.stdout.rows < MIN_ROWS) {
        console.log(languages[currentLanguage].resize_message.replace('{columns}', MIN_COLUMNS).replace('{rows}', MIN_ROWS));
        process.exit();
    }

    print(ANSI.HIDE_CURSOR);
    clearScreen();
    MAIN_MENU_ITEMS = buildMainMenu();
    mainMenuScene = createMenu(MAIN_MENU_ITEMS);
    SplashScreen.next = mainMenuScene;
    currentState = SplashScreen;
    gameLoop = setInterval(update, GAME_FPS);
})();

function update() {
    currentState.update(GAME_FPS);
    currentState.draw(GAME_FPS);
    if (currentState.transitionTo != null) {
        currentState = currentState.next;
        print(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
    }
}

function buildMainMenu() {
    let menuItemCount = 0;
    return [
        {
            text: languages[currentLanguage].menu.start_game, id: menuItemCount++, action: function () {
                clearScreen();
                let innbetween = createInnBetweenScreen();
                innbetween.init(languages[currentLanguage].ship_placement_instructions.replace('{player}', 'Player 1').replace('{other_player}', 'Player 2'), () => {

                    let p1map = createMapLayoutScreen(currentLanguage);
                    p1map.init(FIRST_PLAYER, (player1ShipMap) => {
                        let innbetween = createInnBetweenScreen();
                        innbetween.init(languages[currentLanguage].ship_placement_instructions.replace('{player}', 'Player 2').replace('{other_player}', 'Player 1'), () => {
                            let p2map = createMapLayoutScreen(currentLanguage);
                            p2map.init(SECOND_PLAYER, (player2ShipMap) => {
                                let battleScreen = createBattleshipScreen(player1ShipMap, player2ShipMap, currentLanguage);
                                battleScreen.init();
                                return battleScreen;
                            });
                            return p2map;
                        });
                        return innbetween;
                    });
                    return p1map;

                }, 3);
                currentState.next = innbetween;
                currentState.transitionTo = "Map layout";
            }
        },
        {
            text: languages[currentLanguage].menu.language_option, id: menuItemCount++, action: function () {
                let languageMenuItems = buildLanguageMenu();
                let languageMenuScene = createMenu(languageMenuItems, languages[currentLanguage].menu.select_language);
                languageMenuScene.previousScene = mainMenuScene;
                currentState.next = languageMenuScene;
                currentState.transitionTo = "Language Menu";
            }
        },
        {
            text: languages[currentLanguage].menu.exit_game, id: menuItemCount++, action: function () {
                print(ANSI.SHOW_CURSOR);
                clearScreen();
                process.exit();
            }
        },
    ];
}

function buildLanguageMenu() {
    let menuItemCount = 0;
    return [
        {
            text: languages[currentLanguage].menu.english, id: menuItemCount++, action: function () {
                currentLanguage = 'en';
                MAIN_MENU_ITEMS = buildMainMenu(); // Rebuild main menu with new language
                mainMenuScene = createMenu(MAIN_MENU_ITEMS);
                currentState.next = mainMenuScene;
                currentState.transitionTo = "Main Menu";
            }
        },
        {
            text: languages[currentLanguage].menu.norwegian, id: menuItemCount++, action: function () {
                currentLanguage = 'no';
                MAIN_MENU_ITEMS = buildMainMenu();
                mainMenuScene = createMenu(MAIN_MENU_ITEMS);
                currentState.next = mainMenuScene;
                currentState.transitionTo = "Main Menu";
            }
        },
        {
            text: languages[currentLanguage].menu.back, id: menuItemCount++, action: function () {
                currentState.next = mainMenuScene;
                currentState.transitionTo = "Main Menu";
            }
        },
    ];
}

export { mainMenuScene, currentState };
