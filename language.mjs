// utils/language.mjs

let language = 'en'; // default language

const translations = {
    en: {
        selectLanguage: "Please choose a language:",
        english: "English",
        norwegian: "Norwegian",
        invalidOption: "Invalid option. Please try again.",
        welcome: "Welcome to Battleships!",
        startGame: "Start Game",
        exitGame: "Exit Game",
        shipPlacementPhase: "Ship Placement Phase",
        controls: "Controls",
        arrowKeys: "Arrow keys",
        moveCursor: "Move cursor",
        rotateShip: "Rotate ship",
        placeShip: "Place ship",
        shipsToPlace: "Ships to place",
        spaces: "spaces",
        player: "Player",
        wins: "wins",
        hit: "Hit!",
        miss: "Miss!",
        enterCoordinates: "Enter coordinates to attack (e.g., A5): ",
        invalidCoordinates: "Invalid coordinates. Please try again.",
        shipPlacementFirstPlayer: "SHIP PLACEMENT\nFirst player get ready.\nPlayer two look away",
        shipPlacementSecondPlayer: "SHIP PLACEMENT\nSecond player get ready.\nPlayer one look away",
        gameOver: "Game Over",
        loading: "Loading...",
        pressEnterToContinue: "Press Enter to continue...",
    },
    no: {
        selectLanguage: "Vennligst velg et språk:",
        english: "Engelsk",
        norwegian: "Norsk",
        invalidOption: "Ugyldig valg. Vennligst prøv igjen.",
        welcome: "Velkommen til Sjøslag!",
        startGame: "Start spillet",
        exitGame: "Avslutt spillet",
        shipPlacementPhase: "Plasseringsfase for skip",
        controls: "Kontroller",
        arrowKeys: "Piltaster",
        moveCursor: "Flytt markøren",
        rotateShip: "Roter skip",
        placeShip: "Plasser skip",
        shipsToPlace: "Skip å plassere",
        spaces: "ruter",
        player: "Spiller",
        wins: "vinner",
        hit: "Treff!",
        miss: "Bom!",
        enterCoordinates: "Skriv inn koordinater for angrep (f.eks., A5): ",
        invalidCoordinates: "Ugyldige koordinater. Vennligst prøv igjen.",
        shipPlacementFirstPlayer: "PLASSERING AV SKIP\nFørste spiller gjør seg klar.\nSpiller to se vekk",
        shipPlacementSecondPlayer: "PLASSERING AV SKIP\nAndre spiller gjør seg klar.\nSpiller en se vekk",
        gameOver: "Spillet er over",
        loading: "Laster...",
        pressEnterToContinue: "Trykk Enter for å fortsette...",
    }
};

function t(key) {
    return translations[language][key] || key;
}

function setLanguage(lang) {
    language = lang;
}

export { t, setLanguage };
