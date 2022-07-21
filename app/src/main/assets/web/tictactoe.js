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

function setFields() {

    /*topLeft = Math.floor(gameNumber % 1000000000 / 100000000);
    topMid = Math.floor(gameNumber % 100000000 / 10000000);
    topRight = Math.floor(gameNumber % 10000000 / 1000000);
    midLeft = Math.floor(gameNumber % 1000000 / 100000);
    midMid = Math.floor(gameNumber % 100000 / 10000);
    midRight = Math.floor(gameNumber % 10000 / 1000);
    bottomLeft = Math.floor(gameNumber % 1000 / 100);
    bottomMid = Math.floor(gameNumber % 100 / 10);
    bottomRight = Math.floor(gameNumber % 10 / 1);*/

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

function setStates(newMessage) {
    oldNumber = tremola.games[curr_game].gameState;
    newNumber = String(newMessage);
    //oldState = Math.floor(tremola.games[curr_game].gameState / 1000000000);
    //newState = Math.floor(newMessage / 1000000000);
    oldState = tremola.games[curr_game].gameState.charAt(0);
    newState = String(newMessage).charAt(0);
}

function update(newMessage) { //ACHTUNG: startet bei 1 nicht bei 0
    setStates(newMessage);
    if (oldNumber === flipNumbers(newNumber)) {//wiederholtes  öffnen des Spiels. Nichts muss geupdatet werden.
        display();
        //launch_snackbar(newState);
        return; //Vielleicht muss newState noch geflipt werden!
    }
    if (newState === "1") { //restart
        tremola.games[curr_game].gameState = "1000000000";
        display();
        return;
    }
    if (/*oldState === "1" && */newState === "2") { //Gegner hat invited -> accept decline
        displayAcceptDecline();
        return;
    }
    if (/*oldState === "2" && */newState === "3" || oldState === "3" && newState === "3") { //ich invited, gegner accepted und erster spielzug, oder normaler spielverlauf
        tremola.games[curr_game].gameState = flipNumbers(String(newNumber));
        display();
        return;
    }
    if (/*oldState === "3" && */newState === "4") { //Gegner gewonnen -> you lost
        tremola.games[curr_game].gameState = flipNumbers(String(newNumber));
        display();
        return;
    }
    if (newState === "5") {
        tremola.games[curr_game].gameState = flipNumbers(String(newNumber));
        display();
    }
}

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

function displayAcceptDecline() {
    disableAllFields();
    accept = 1;
    //launch_snackbar("displayAcceptdevlne");
    var btn = document.getElementById('btn:invite');
    btn.innerHTML = 'accept';
    btn.disabled = false;

    var btn2 = document.getElementById('btn:restart');
    btn2.innerHTML = 'decline';
    btn2.disabled = false;
}

function displayOwn() {
    var state = tremola.games[curr_game].gameState.charAt(0);
    gameNumber = tremola.games[curr_game].gameState;
    //gameNumber = "1012012012";
    if (state === "1") {
        startConfiguration();
    } else if (state === "2") {
        launch_snackbar("waiting for enemy to accept");
        disableRestartButton();
        disableInviteButton();
        disableAllFields();

        //tesing purpose:
        //displayFields();
        //displayAcceptDecline();
    } else if (state === "3") {
        displayFields();
        disableInviteButton();
        enableRestartButton();
        disableAllFieldsWithoutReset();
    } else if (state === "4") {
        displayFields();
        disableInviteButton();
        enableRestartButton();
        launch_snackbar("YOU WON!!!!");
    } else if (state === "5") { //no winner
        displayFields();
        disableAllFieldsWithoutReset();
        disableInviteButton();
        enableRestartButton();
        launch_snackbar("GAME ENDED, NO WINNER");
    }
}

function display() {
    var state = tremola.games[curr_game].gameState.charAt(0);
    gameNumber = tremola.games[curr_game].gameState;
    //gameNumber = "1012012012";
    if (state === "1") {
        startConfiguration();
    } else if (state === "3") {
        displayFields();
        disableInviteButton();
        enableRestartButton();
    } else if (state === "4") {
        displayFields();
        disableAllFieldsWithoutReset();
        disableInviteButton();
        enableRestartButton();
        launch_snackbar("YOU LOST!!!");
    } else if (state === "4") {
        displayFields();
        disableAllFieldsWithoutReset();
        disableInviteButton();
        enableRestartButton();
        launch_snackbar("GAME ENDED, NO WINNER");
    }
}

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
    launch_snackbar("all buttons reset");
}

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