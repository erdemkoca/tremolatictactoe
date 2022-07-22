"use strict";

var topLeft;
var topMid;
var topRight;
var midLeft;
var midMid;
var midRight;
var bottomLeft;
var bottomMid;
var bottomRight;
var oldState;
var newState;
var gameNumber;
var oldNumber;
var newNumber;
var accept = 0;

/**
 * Diese Methode setzt die Variablen für die einzelnen Felder/Buttons auf 0, 1 oder 2.
 * gameNumber muss vor dem Aufruf dieser Methode aktualisiert werden.
 */
function setFields() {
    topLeft = gameNumber.charAt(1);
    topMid = gameNumber.charAt(2);
    topRight = gameNumber.charAt(3);
    midLeft = gameNumber.charAt(4);
    midMid = gameNumber.charAt(5);
    midRight = gameNumber.charAt(6);
    bottomLeft = gameNumber.charAt(7);
    bottomMid = gameNumber.charAt(8);
    bottomRight = gameNumber.charAt(9);
}

/**
 * Diese Methode setzt die Variablen des vorherigen Spielstandes und des neuen Spielstandes, welche
 * in newMessage übergeben wird.
 */

function setStates(newMessage) {
    oldNumber = tremola.games[curr_game].gameState;
    newNumber = String(newMessage);
    oldState = tremola.games[curr_game].gameState.charAt(0);
    newState = String(newMessage).charAt(0);
}

/**
 * Diese Methode wird aufgerufen, falls eine neue Nachricht vom Gegner empfangen wird. Mittels des
 * neuen Spielstand, welcher mit newMessage übergeben wird, wird die dazugehörige Aktion durchgeführt.
 */
function update(newMessage) {
    setStates(newMessage);
    if (oldNumber === flipNumbers(newNumber)) {//wiederholtes  öffnen des Spiels. Nichts muss geupdatet werden.
        display();
        return;
    }
    if (newState === "1") { //restart
        tremola.games[curr_game].gameState = "1000000000";
        display();
        return;
    }
    if (newState === "2") { //Gegner hat invited -> accept/decline
        displayAcceptDecline();
        return;
    }
    if (newState === "3") { //Selber invited, gegner accepted und erster spielzug, oder normaler spielverlauf
        tremola.games[curr_game].gameState = flipNumbers(String(newNumber));
        display();
        return;
    }
    if (newState === "4") { //Gegner gewonnen -> you lost
        tremola.games[curr_game].gameState = flipNumbers(String(newNumber));
        display();
        return;
    }
    if (newState === "5") { //Spielfeld ist voll, kein Gewinner
        tremola.games[curr_game].gameState = flipNumbers(String(newNumber));
        display();
    }
}

/**
 * Dieser Methode wird ein String mit einer Zahl (number) übergeben. Dabei werden alle einsen mit zweien
 * getauscht und umgekehrt (Ausser die erste Ziffer, da diese für den Spielstand steht und nicht für ein Feld).
 * Dies ist nötig, falls ein Spielstand vom Gegner empfangen wird, um die Felder richtig anzuzeigen.
 */
function flipNumbers(number) {
    var digit;
    for (let i = 1; i < String(number).length; i++) {
        digit = number.charAt(i);
        if (digit === "1") {
            number = replaceNumber(number, "2", i);
        } else if (digit === "2") {
            number = replaceNumber(number, "1", i);
        }
    }
    return number;
}

/**
 * Diese Methode ladet die Accept und Decline Buttons, indem sie den Text des invite-Buttons auf "accept"
 * setzt und den Text des restart-Buttons auf "decline" setzt. Zudem wird die Variable accept auf 1 gesetzt,
 * damit in der onClick Methode des invite-Buttons invite(), der accept-Modus aktiviert wird.
 */
function displayAcceptDecline() {
    disableAllFields();
    accept = 1;
    var btn = document.getElementById('btn:invite');
    btn.innerHTML = 'accept';
    btn.disabled = false;

    var btn2 = document.getElementById('btn:restart');
    btn2.innerHTML = 'decline';
    btn2.disabled = false;
}

/**
 * Diese Methode ladet den Spielstand, welcher in tremola.games[curr_game].gameState gespeichert ist,
 * wenn man selbst eine Aktion durcheführt hat.
 */
function displayOwn() {
    var state = tremola.games[curr_game].gameState.charAt(0);
    gameNumber = tremola.games[curr_game].gameState;
    //gameNumber = "1012012012";
    if (state === "1") { //Start-Konfiguration
        startConfiguration();
    } else if (state === "2") { // Invited
        launch_snackbar("waiting for enemy to accept");
        enableRestartButton();
        disableInviteButton();
        disableAllFields();

        //tesing purpose:
        //displayFields();
        //displayAcceptDecline();
    } else if (state === "3") { //Spielzug
        displayFields();
        disableInviteButton();
        enableRestartButton();
        disableAllFieldsWithoutReset();
    } else if (state === "4") { // gewonnen
        displayFields();
        disableInviteButton();
        enableRestartButton();
        launch_snackbar("YOU WON!!!!");
    } else if (state === "5") { //Spielfeld voll, kein Gewinner
        displayFields();
        disableAllFieldsWithoutReset();
        disableInviteButton();
        enableRestartButton();
        launch_snackbar("GAME ENDED, NO WINNER");
    }
}

/**
 * Diese Methode wird verwendet, um den Spielstand zu laden, nachdem der Gegner eine Aktion
 * durchgeführt hat und man selbst die nächste Aktion durchführen muss.
 */
function display() {
    var state = tremola.games[curr_game].gameState.charAt(0);
    gameNumber = tremola.games[curr_game].gameState;
    //gameNumber = "1012012012";
    if (state === "1") { // Start-Konfiguration
        startConfiguration();
    } else if (state === "3") { //Spielzug, jetzt selbst an der Reihe
        displayFields();
        disableInviteButton();
        enableRestartButton();
    } else if (state === "4") {// Gegner hat gewonnen
        displayFields();
        disableAllFieldsWithoutReset();
        disableInviteButton();
        enableRestartButton();
        launch_snackbar("YOU LOST!!!");
    } else if (state === "5") { //Spielfeld voll, kein Gewinner
         displayFields();
         disableAllFieldsWithoutReset();
         disableInviteButton();
         enableRestartButton();
         launch_snackbar("GAME ENDED, NO WINNER");
    }
}

/**
 * Diese Methode wird verwendet, um den Text der Spielfeld-Buttons auf "leer", "X" (eigene Markierung)
 * oder "O" (gegnerische Markierung) zu setzten, wobei diese die Variablen, welche in setFields(),
 * gesetzt werden verwendet.
 */
function displayFields() {
        setFields();
        //topLeft
        var curr_btn = document.getElementById('topLeft');
        if (topLeft === "0") {
            curr_btn.innerHTML = '';
            curr_btn.disabled = false;
        } else if (topLeft === "1") {
            curr_btn.innerHTML = 'X';
            curr_btn.disabled = true;
        } else {
            curr_btn.innerHTML = 'O';
            curr_btn.disabled = true;
        }
        //topMid
        curr_btn = document.getElementById('topMid');
        if (topMid === "0") {
            curr_btn.innerHTML = '';
            curr_btn.disabled = false;
        } else if (topMid === "1") {
            curr_btn.innerHTML = 'X';
            curr_btn.disabled = true;
        } else {
            curr_btn.innerHTML = 'O';
            curr_btn.disabled = true;
        }
        //topRight
        curr_btn = document.getElementById('topRight');
        if (topRight === "0") {
            curr_btn.innerHTML = '';
            curr_btn.disabled = false;
        } else if (topRight === "1") {
            curr_btn.innerHTML = 'X';
            curr_btn.disabled = true;
        } else {
            curr_btn.innerHTML = 'O';
            curr_btn.disabled = true;
        }
        //midLeft
        curr_btn = document.getElementById('midLeft');
        if (midLeft === "0") {
            curr_btn.innerHTML = '';
            curr_btn.disabled = false;
        } else if (midLeft === "1") {
            curr_btn.innerHTML = 'X';
            curr_btn.disabled = true;
        } else {
            curr_btn.innerHTML = 'O';
            curr_btn.disabled = true;
        }
        //midMid
        curr_btn = document.getElementById('midMid');
        if (midMid === "0") {
            curr_btn.innerHTML = '';
            curr_btn.disabled = false;
        } else if (midMid === "1") {
            curr_btn.innerHTML = 'X';
            curr_btn.disabled = true;
        } else {
            curr_btn.innerHTML = 'O';
            curr_btn.disabled = true;
        }
        //midRight
        curr_btn = document.getElementById('midRight');
        if (midRight === "0") {
            curr_btn.innerHTML = '';
            curr_btn.disabled = false;
        } else if (midRight === "1") {
            curr_btn.innerHTML = 'X';
            curr_btn.disabled = true;
        } else {
            curr_btn.innerHTML = 'O';
            curr_btn.disabled = true;
        }
        //bottomLeft
        curr_btn = document.getElementById('bottomLeft');
        if (bottomLeft === "0") {
            curr_btn.innerHTML = '';
            curr_btn.disabled = false;
        } else if (bottomLeft === "1") {
            curr_btn.innerHTML = 'X';
            curr_btn.disabled = true;
        } else {
            curr_btn.innerHTML = 'O';
            curr_btn.disabled = true;
        }
        //bottomMid
        curr_btn = document.getElementById('bottomMid');
        if (bottomMid === "0") {
            curr_btn.innerHTML = '';
            curr_btn.disabled = false;
        } else if (bottomMid === "1") {
            curr_btn.innerHTML = 'X';
            curr_btn.disabled = true;
        } else {
            curr_btn.innerHTML = 'O';
            curr_btn.disabled = true;
        }
        //bottomRight
        curr_btn = document.getElementById('bottomRight');
        if (bottomRight === "0") {
            curr_btn.innerHTML = '';
            curr_btn.disabled = false;
        } else if (bottomRight === "1") {
            curr_btn.innerHTML = 'X';
            curr_btn.disabled = true;
        } else {
            curr_btn.innerHTML = 'O';
            curr_btn.disabled = true;
        }
}

/**
 * Diese Methode wird aufgerufen wenn noch kein Spiel gestartet wurde. Dabei werden nur der invite-Button
 * und der Restart-Button aktiviert.
 */
function startConfiguration() {
    disableAllFields();
    enableInviteButton();
    enableRestartButton();
}

function disableInviteButton() {
    var btn = document.getElementById('btn:invite');
        btn.innerHTML = 'invite';
        btn.disabled = true;
}

function enableInviteButton() {
    var btn = document.getElementById('btn:invite');
    btn.innerHTML = 'invite';
    btn.disabled = false;
}

function disableRestartButton() {
    var btn = document.getElementById('btn:restart');
    btn.innerHTML = 'restart';
    btn.disabled = true;
}

function enableRestartButton() {
    var btn = document.getElementById('btn:restart');
    btn.innerHTML = 'restart';
    btn.disabled = false;
}

/**
 * Diese Methode setzt alle Spielfelder auf "leer" und enabled sie.
 */
function resetAllFields() {
    var btn = document.getElementById('topLeft');
    btn.innerHTML = '';
    btn.disabled = false;

    btn = document.getElementById('topMid');
    btn.innerHTML = '';
    btn.disabled = false;

    btn = document.getElementById('topRight');
    btn.innerHTML = '';
    btn.disabled = false;

    btn = document.getElementById('midLeft');
    btn.innerHTML = '';
    btn.disabled = false;

    btn = document.getElementById('midMid');
    btn.innerHTML = '';
    btn.disabled = false;

    btn = document.getElementById('midRight');
    btn.innerHTML = '';
    btn.disabled = false;

    btn = document.getElementById('bottomLeft');
    btn.innerHTML = '';
    btn.disabled = false;

    btn = document.getElementById('bottomMid');
    btn.innerHTML = '';
    btn.disabled = false;

    btn = document.getElementById('bottomRight');
    btn.innerHTML = '';
    btn.disabled = false;
}

/**
 * Diese Methode disabled alle Spielfelder, jedoch ohne den Text auf "leer" zu setzen.
 */
function disableAllFieldsWithoutReset() {
    var btn = document.getElementById('topLeft');
        btn.disabled = true;

        btn = document.getElementById('topMid');
        btn.disabled = true;

        btn = document.getElementById('topRight');
        btn.disabled = true;

        btn = document.getElementById('midLeft');
        btn.disabled = true;

        btn = document.getElementById('midMid');
        btn.disabled = true;

        btn = document.getElementById('midRight');
        btn.disabled = true;

        btn = document.getElementById('bottomLeft');
        btn.disabled = true;

        btn = document.getElementById('bottomMid');
        btn.disabled = true;

        btn = document.getElementById('bottomRight');
        btn.disabled = true;
}

/**
 * Diese Methode setzt alle Spielfelder auf "leer" und disabled sie.
 */
function disableAllFields() {
    var btn = document.getElementById('topLeft');
    btn.innerHTML = '';
    btn.disabled = true;

    btn = document.getElementById('topMid');
    btn.innerHTML = '';
    btn.disabled = true;

    btn = document.getElementById('topRight');
    btn.innerHTML = '';
    btn.disabled = true;

    btn = document.getElementById('midLeft');
    btn.innerHTML = '';
    btn.disabled = true;

    btn = document.getElementById('midMid');
    btn.innerHTML = '';
    btn.disabled = true;

    btn = document.getElementById('midRight');
    btn.innerHTML = '';
    btn.disabled = true;

    btn = document.getElementById('bottomLeft');
    btn.innerHTML = '';
    btn.disabled = true;

    btn = document.getElementById('bottomMid');
    btn.innerHTML = '';
    btn.disabled = true;

    btn = document.getElementById('bottomRight');
    btn.innerHTML = '';
    btn.disabled = true;
}

/**
 * Diese Methode überprüft nach einem Spielzug, ob man gewonnen hat, indem sie durch alle Gewinner-Szenarien geht
 * und schaut, ob diese zutreffen.
 * Falls ja, return true, falls nein, return false
 */
function checkIfWin() {
    if (topLeft === "1" && midLeft === "1" && bottomLeft === "1") {
        return true;
    } else if (topMid === "1" && midMid === "1" && bottomMid === "1") {
        return true;
    } else if (topRight === "1" && midRight === "1" && bottomRight === "1") {
        return true;
    } else if (topLeft === "1" && topMid === "1" && topRight === "1") {
        return true;
    } else if (midLeft === "1" && midMid === "1" && midRight === "1") {
        return true;
    } else if (bottomLeft === "1" && bottomMid === "1" && bottomRight === "1") {
        return true;
    } else if (topLeft === "1" && midMid === "1" && bottomRight === "1") {
        return true;
    } else if (topRight === "1" && midMid === "1" && bottomLeft === "1") {
        return true;
    } else {
        return false;
    }
}