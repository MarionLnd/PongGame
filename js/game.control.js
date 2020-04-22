game.control = {
    controlSystem: null,
    mousePointer: null,

    onKeyDown: function(event) {
        if(game.control.controlSystem === "KEYBOARD") {
            if(event.code === game.keycode.KEYDOWNSTRING) {
                game.playerOne.goDown = true
            } else if(event.code === game.keycode.KEYUPSTRING) {
                game.playerOne.goUp = true;
            }
        }
        if(event.code === game.keycode.SPACEBARSSTRING && !game.ball.inGame && game.gameOn) {
            game.ball.inGame = true;
            game.ball.sprite.posX = game.playerOne.sprite.posX + game.playerOne.sprite.width;
            game.ball.sprite.posY = game.playerOne.sprite.posY;
            game.ball.directionX = 1;
            game.ball.directionY = 1;
        }
    },

    onKeyUp: function(event) {
        if(event.code === game.keycode.KEYUPSTRING) {
            game.playerOne.goDown = false;
        } else if(event.code === game.keycode.KEYDOWNSTRING) {
            game.playerOne.goUp = false;
        }
    },

    onMouseMove: function(event) {
        if(game.control.controlSystem === "MOUSE" && game.gameOn) {
            console.log(event.clientY);
            console.log(event.clientY - game.conf.MOUSECORRECTIONPOSY);
            if(event){
                game.control.mousePointer = event.clientY - game.conf.MOUSECORRECTIONPOSY;
            }
            if(game.control.mousePointer > game.playerOne.sprite.posY) {
                game.playerOne.goDown = true;
                game.playerOne.goUp = false;
            } else if(game.control.mousePointer < game.playerOne.sprite.posY) {
                game.playerOne.goDown = false;
                game.playerOne.goUp = true;
            } else {
                game.playerOne.goDown = false;
                game.playerOne.goUp = true;
            }
        }
    },

    onStartGameClickButton: function() {
        if(!game.gameOn && game.control.controlSystem !== null && game.iaMode === true) {
            game.reinitGame();
            game.gameOn = true;
            game.ball.inGame = true;
            game.ball.sprite.posX = game.playerOne.sprite.posX + game.playerOne.sprite.width;
            game.ball.sprite.posY = game.playerOne.sprite.posY;
            game.ball.directionX = 1;
            game.ball.directionY = 1;
        }
        if (!game.gameOn && game.control.controlSystem !== null && game.onlineMode === true) {
            console.log(game.gameOn);
            console.log(game.control.controlSystem);
            console.log(game.iaMode);
            console.log(game.onlineMode);
        }
    },

    onMouseControlClickButton: function() {
        game.control.controlSystem = "MOUSE";
    },

    onKeyboardControlClickButton: function() {
        game.control.controlSystem = "KEYBOARD";
    },

    onIAClickButton: function() {
        if(!game.ball.inGame) {
            game.iaMode = true;
            game.onlineMode = false;
            game.playerOne.ai = false;
            game.playerTwo.ai = true;
        }
    },

    onMultiplayerClickButton: function() {
        if(!game.ball.inGame) {
            game.iaMode = false;
            game.onlineMode = true;
            game.playerOne.ai = false;
            game.playerTwo.ai = false;
        }
    }
};